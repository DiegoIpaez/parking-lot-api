import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateParkingSpaceDto } from './dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from './dto/update-parking-space.dto';
import { ParkingSpaceStatus } from '@prisma/client';

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

  async findAll(sectorId?: number, status?: ParkingSpaceStatus) {
    return this.prisma.parkingSpace.findMany({
      where: {
        ...(sectorId && { sectorId }),
        ...(status && { status }),
      },
      include: {
        sector: true,
      },
      orderBy: [{ sectorId: 'asc' }, { number: 'asc' }],
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
