import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import { FindVehicleModelsDto } from './dto/find-vehicle-models.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehicleModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindVehicleModelsDto) {
    const { page, limit, showAll, search } = query;
    const where: Prisma.VehicleModelWhereInput = { deleted: false };
    if (query.vehicleBrandId) {
      where.vehicleBrandId = query.vehicleBrandId;
    }
    if (search) {
      where.name = { contains: search, mode: Prisma.QueryMode.insensitive };
    }

    const queryClause: Prisma.VehicleModelFindManyArgs = {
      where,
      include: {
        vehicleBrand: true,
      },
      orderBy: { name: Prisma.SortOrder.asc },
    };
    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }
    const data = await this.prisma.vehicleModel.findMany(queryClause);
    const totalRecords = await this.prisma.vehicleModel.count({ where });
    return paginationFormatter({ page, limit, data, totalRecords, showAll });
  }
}
