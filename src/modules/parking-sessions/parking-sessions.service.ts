import {
  ParkingSpaceStatus,
  ParkingSessionStatus,
  Prisma,
} from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import { CreateParkingSessionDto } from './dto/create-parking-session.dto';
import { CheckoutParkingSessionDto } from './dto/checkout-parking-session.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { FindParkingSessionsDto } from './dto/find-parking-sessions.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';

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
              vehicleModel: {
                include: {
                  vehicleType: true,
                  vehicleBrand: true,
                },
              },
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

  async findAll(query: FindParkingSessionsDto) {
    const { page, limit, showAll, search } = query;
    const whereClause: Prisma.ParkingSessionWhereInput = {
      deleted: true,
    };

    if (query.checkInTime) {
      whereClause.checkInTime = { gte: query.checkInTime };
    }
    if (query.checkOutTime) {
      whereClause.checkOutTime = { lte: query.checkOutTime };
    }
    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.vehicleId) {
      whereClause.vehicleId = query.vehicleId;
    }
    if (query.parkingSpaceId) {
      whereClause.parkingSpaceId = query.parkingSpaceId;
    }
    if (query.checkInUserId) {
      whereClause.checkInUserId = query.checkInUserId;
    }
    if (query.checkOutUserId) {
      whereClause.checkOutUserId = query.checkOutUserId;
    }
    if (query.vehicleLicensePlate || search) {
      whereClause.vehicle = {
        licensePlate: {
          contains: query.vehicleLicensePlate || search,
          mode: Prisma.QueryMode.insensitive,
        },
      };
    }

    const queryClause: Prisma.ParkingSessionFindManyArgs = {
      where: whereClause,
      include: {
        vehicle: {
          include: {
            vehicleModel: {
              include: {
                vehicleType: true,
                vehicleBrand: true,
              },
            },
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
        checkInTime: Prisma.SortOrder.desc,
      },
    };

    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.parkingSession.findMany(queryClause);
    const totalRecords = await this.prisma.parkingSession.count({
      where: whereClause,
    });
    return paginationFormatter({
      page,
      limit,
      data,
      totalRecords,
      showAll,
    });
  }

  async findOne(id: number) {
    const session = await this.prisma.parkingSession.findFirst({
      where: { id, deleted: false },
      include: {
        vehicle: {
          include: {
            vehicleModel: {
              include: {
                vehicleType: true,
                vehicleBrand: true,
              },
            },
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

  async checkout(id: number, checkoutDto: CheckoutParkingSessionDto) {
    const session = await this.findOne(id);

    if (session.status === ParkingSessionStatus.COMPLETED) {
      throw new BadRequestException('Session is already completed');
    }

    const checkOutTime = new Date();
    const durationMinutes = Math.ceil(
      (checkOutTime.getTime() - session.checkInTime.getTime()) / (1000 * 60)
    );

    const ratePerMinute =
      session?.vehicle?.vehicleModel?.vehicleType?.ratePerMinute || 0;

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
              vehicleModel: {
                include: {
                  vehicleType: true,
                  vehicleBrand: true,
                },
              },
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

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.parkingSession.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
