import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: createVehicleDto,
      include: {
        vehicleType: true,
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany({
      include: {
        vehicleType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        vehicleType: true,
        parkingSessions: {
          include: {
            parkingSpace: {
              include: {
                sector: true,
              },
            },
          },
          orderBy: {
            checkInTime: 'desc',
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async findByLicensePlate(licensePlate: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { licensePlate },
      include: {
        vehicleType: true,
        parkingSessions: {
          include: {
            parkingSpace: {
              include: {
                sector: true,
              },
            },
          },
          orderBy: {
            checkInTime: 'desc',
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with license plate ${licensePlate} not found`
      );
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
      include: {
        vehicleType: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
