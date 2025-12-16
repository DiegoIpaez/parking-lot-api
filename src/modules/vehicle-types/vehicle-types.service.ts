import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { paginationFormatter } from '@/utils/pagination/pagination.util';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { FindVehicleTypesDto } from './dto/find-vehicle-types.dto';

@Injectable()
export class VehicleTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleTypeDto: CreateVehicleTypeDto) {
    return this.prisma.vehicleType.create({
      data: createVehicleTypeDto,
    });
  }

  async findAll(query: FindVehicleTypesDto) {
    const { page, limit, showAll, search } = query;
    const whereClause: Prisma.VehicleTypeWhereInput = {
      deleted: false,
    };

    if (search)
      whereClause.name = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };

    const queryClause: Prisma.VehicleTypeFindManyArgs = {
      where: whereClause,
      orderBy: {
        name: Prisma.SortOrder.desc,
      },
    };
    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.vehicleType.findMany(queryClause);
    const totalRecords = await this.prisma.vehicleType.count({
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
    const vehicleType = await this.prisma.vehicleType.findFirst({
      where: { id, deleted: false },
      include: {
        vehicleModels: true,
      },
    });

    if (!vehicleType) {
      throw new NotFoundException(`Vehicle type with ID ${id} not found`);
    }

    return vehicleType;
  }

  async update(id: number, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    await this.findOne(id);
    return this.prisma.vehicleType.update({
      where: { id },
      data: updateVehicleTypeDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.vehicleType.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
