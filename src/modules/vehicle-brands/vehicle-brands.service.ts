import { Injectable } from '@nestjs/common';
import { Prisma, VehicleBrand } from '@prisma/client';
import { FindVehicleBrandsDto } from './dto/find-vehicle-brands.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';
import { PrismaService } from '@/services/prisma/prisma.service';

@Injectable()
export class VehicleBrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindVehicleBrandsDto) {
    const { page, limit, showAll, search } = query;
    const whereClause: Prisma.VehicleBrandWhereInput = { deleted: false };
    if (search) {
      whereClause.name = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    const queryClause: Prisma.VehicleBrandFindManyArgs = {
      where: whereClause,
      orderBy: {
        createdAt: Prisma.SortOrder.asc,
      },
    };
    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.vehicleBrand.findMany(queryClause);
    const totalRecords = await this.prisma.vehicleBrand.count({
      where: whereClause,
    });

    return paginationFormatter<VehicleBrand>({
      page,
      limit,
      data,
      totalRecords,
      showAll,
    });
  }
}
