import { ParkingSessionStatus, Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import { FindSectorsDto } from './dto/find-sectors.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { CreateSectorDto } from './dto/create-sector.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';

@Injectable()
export class SectorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSectorDto: CreateSectorDto) {
    return this.prisma.sector.create({
      data: createSectorDto,
    });
  }

  async findAll(query: FindSectorsDto) {
    const { page, limit, showAll, search } = query;
    const whereClause: Prisma.SectorWhereInput = {};

    if (search) {
      whereClause.name = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
    }
    if (query.parkingSpaceStatus) {
      whereClause.parkingSpaces = {
        some: { status: query.parkingSpaceStatus },
      };
    }

    const queryClause: Prisma.SectorFindManyArgs = {
      where: whereClause,
      include: {
        parkingSpaces: {
          include: {
            parkingSessions: {
              take: 1,
              include: {
                vehicle: true,
                checkInUser: true,
              },
              where: {
                status: ParkingSessionStatus.ACTIVE,
                checkOutTime: null,
                checkOutUserId: null,
              },
            },
          },
          orderBy: {
            number: Prisma.SortOrder.asc,
          },
        },
        _count: true,
      },
      orderBy: {
        name: Prisma.SortOrder.asc,
      },
    };

    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.sector.findMany(queryClause);
    const totalRecords = await this.prisma.sector.count({ where: whereClause });

    return paginationFormatter({
      page,
      limit,
      data,
      totalRecords,
      showAll,
    });
  }

  async findOne(id: number) {
    const sector = await this.prisma.sector.findUnique({
      where: { id },
      include: {
        parkingSpaces: true,
      },
    });

    if (!sector) {
      throw new NotFoundException(`Sector with ID ${id} not found`);
    }

    return sector;
  }

  async update(id: number, updateSectorDto: UpdateSectorDto) {
    await this.findOne(id);

    return this.prisma.sector.update({
      where: { id },
      data: updateSectorDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.sector.delete({
      where: { id },
    });
  }
}
