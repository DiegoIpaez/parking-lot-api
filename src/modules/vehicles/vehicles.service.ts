import { ParkingSessionStatus, Prisma } from '@prisma/client';
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
        vehicleModel: {
          include: {
            vehicleBrand: true,
          },
        },
      },
    });
  }

  async findAll(query?: FindVehiclesDto) {
    const { limit, page, showAll, search } = query;

    const whereClause: Prisma.VehicleWhereInput = {
      deleted: false,
      ...(search && {
        licensePlate: { contains: search, mode: Prisma.QueryMode.insensitive },
      }),
      ...(query?.vehicleTypeId && { vehicleTypeId: query.vehicleTypeId }),
      ...(query?.vehicleModelId && { vehicleModelId: query.vehicleModelId }),
    };
    const queryClause: Prisma.VehicleFindManyArgs = {
      where: whereClause,
      include: {
        vehicleType: true,
        vehicleModel: {
          include: {
            vehicleBrand: true,
          },
        },
        parkingSessions: {
          include: {
            parkingSpace: {
              include: {
                sector: true,
              },
            },
          },
          orderBy: {
            checkInTime: Prisma.SortOrder.desc,
          },
        },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    };

    if (query?.notParked) {
      queryClause.where.parkingSessions = {
        none: {
          status: ParkingSessionStatus.ACTIVE,
        },
      };
    }

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
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, deleted: false },
      include: {
        vehicleType: true,
        vehicleModel: {
          include: {
            vehicleBrand: true,
          },
        },
        parkingSessions: {
          include: {
            parkingSpace: {
              include: {
                sector: true,
              },
            },
          },
          orderBy: {
            checkInTime: Prisma.SortOrder.desc,
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
        vehicleModel: {
          include: {
            vehicleBrand: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.vehicle.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
