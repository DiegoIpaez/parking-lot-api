import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParkingSessionDto } from './dto/create-parking-session.dto';
import { CheckoutParkingSessionDto } from './dto/checkout-parking-session.dto';
import { ParkingSpaceStatus, ParkingSessionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ParkingSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParkingSessionDto: CreateParkingSessionDto) {
    const parkingSpace = await this.prisma.parkingSpace.findUnique({
      where: { id: createParkingSessionDto.parkingSpaceId },
    });

    if (!parkingSpace) {
      throw new NotFoundException('Parking space not found');
    }

    if (parkingSpace.status !== ParkingSpaceStatus.AVAILABLE) {
      throw new BadRequestException('Parking space is not available');
    }

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: createParkingSessionDto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const activeSession = await this.prisma.parkingSession.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: ParkingSessionStatus.ACTIVE,
      },
    });

    if (activeSession) {
      throw new BadRequestException(
        'Vehicle already has an active parking session'
      );
    }

    const [session] = await this.prisma.$transaction([
      this.prisma.parkingSession.create({
        data: {
          ...createParkingSessionDto,
          status: ParkingSessionStatus.ACTIVE,
        },
        include: {
          vehicle: {
            include: {
              vehicleType: true,
            },
          },
          parkingSpace: {
            include: {
              sector: true,
            },
          },
          checkInUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.parkingSpace.update({
        where: { id: createParkingSessionDto.parkingSpaceId },
        data: { status: ParkingSpaceStatus.OCCUPIED },
      }),
    ]);

    return session;
  }

  async findAll(
    status?: ParkingSessionStatus,
    startDate?: Date,
    endDate?: Date
  ) {
    return this.prisma.parkingSession.findMany({
      where: {
        ...(status && { status }),
        ...(startDate &&
          endDate && {
            checkInTime: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        parkingSpace: {
          include: {
            sector: true,
          },
        },
        checkInUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        checkOutUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.parkingSession.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        parkingSpace: {
          include: {
            sector: true,
          },
        },
        checkInUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        checkOutUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Parking session with ID ${id} not found`);
    }

    return session;
  }

  async checkout(id: string, checkoutDto: CheckoutParkingSessionDto) {
    const session = await this.findOne(id);

    if (session.status === ParkingSessionStatus.COMPLETED) {
      throw new BadRequestException('Session is already completed');
    }

    const checkOutTime = new Date();
    const durationMinutes = Math.ceil(
      (checkOutTime.getTime() - session.checkInTime.getTime()) / (1000 * 60)
    );

    const ratePerMinute = session.vehicle.vehicleType.ratePerMinute;
    const totalAmount = new Decimal(durationMinutes).mul(ratePerMinute);

    const [updatedSession] = await this.prisma.$transaction([
      this.prisma.parkingSession.update({
        where: { id },
        data: {
          checkOutUserId: checkoutDto.checkOutUserId,
          checkOutTime,
          durationMinutes,
          totalAmount,
          status: ParkingSessionStatus.COMPLETED,
        },
        include: {
          vehicle: {
            include: {
              vehicleType: true,
            },
          },
          parkingSpace: {
            include: {
              sector: true,
            },
          },
          checkInUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          checkOutUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.parkingSpace.update({
        where: { id: session.parkingSpaceId },
        data: { status: ParkingSpaceStatus.AVAILABLE },
      }),
    ]);

    return updatedSession;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.parkingSession.delete({
      where: { id },
    });
  }
}
