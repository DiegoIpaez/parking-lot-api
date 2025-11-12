import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import { FindVehiclesDto } from './dto/find-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';

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

  async findAll(query?: FindVehiclesDto) {
    const { limit, page, showAll } = query;

    const whereClause: Prisma.VehicleWhereInput = {
      ...(query?.licensePlate && {
        licensePlate: { contains: query.licensePlate, mode: 'insensitive' },
      }),
      ...(query?.vehicleTypeId && { vehicleTypeId: query.vehicleTypeId }),
      ...(query?.color && { color: query.color }),
      ...(query?.brand && { brand: query.brand }),
      ...(query?.model && { model: query.model }),
    };
    const queryClause: Prisma.VehicleFindManyArgs = {
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc',
      },
    };
    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.vehicle.findMany(queryClause);
    const totalRecords = await this.prisma.vehicle.count({
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

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
      include: {
        vehicleType: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
