import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import { CreateParkingSpaceDto } from './dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from './dto/update-parking-space.dto';
import { FindParkingSpacesDto } from './dto/find-parking-spaces.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';

@Injectable()
export class ParkingSpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParkingSpaceDto: CreateParkingSpaceDto) {
    return this.prisma.parkingSpace.create({
      data: createParkingSpaceDto,
      include: {
        sector: true,
      },
    });
  }

  async findAll(query: FindParkingSpacesDto) {
    const { limit, page, showAll, search } = query;

    const whereClause: Prisma.ParkingSpaceWhereInput = {};

    if (query.sectorId) {
      whereClause.sectorId = query.sectorId;
    }
    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.number || !isNaN(Number(search))) {
      whereClause.number = query.number || Number(search);
    }

    const queryClause: Prisma.ParkingSpaceFindManyArgs = {
      where: whereClause,
      include: {
        sector: true,
      },
      orderBy: [
        { sectorId: Prisma.SortOrder.asc },
        { number: Prisma.SortOrder.asc },
      ],
    };
    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.parkingSpace.findMany(queryClause);
    const totalRecords = await this.prisma.parkingSpace.count({
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
    const parkingSpace = await this.prisma.parkingSpace.findUnique({
      where: { id },
      include: {
        sector: true,
      },
    });

    if (!parkingSpace) {
      throw new NotFoundException(`Parking space with ID ${id} not found`);
    }

    return parkingSpace;
  }

  async update(id: number, updateParkingSpaceDto: UpdateParkingSpaceDto) {
    await this.findOne(id);

    return this.prisma.parkingSpace.update({
      where: { id },
      data: updateParkingSpaceDto,
      include: {
        sector: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.parkingSpace.delete({
      where: { id },
    });
  }
}
