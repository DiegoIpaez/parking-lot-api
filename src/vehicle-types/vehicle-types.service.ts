import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';

@Injectable()
export class VehicleTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleTypeDto: CreateVehicleTypeDto) {
    return this.prisma.vehicleType.create({
      data: createVehicleTypeDto,
    });
  }

  async findAll() {
    return this.prisma.vehicleType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const vehicleType = await this.prisma.vehicleType.findUnique({
      where: { id },
      include: {
        vehicles: true,
      },
    });

    if (!vehicleType) {
      throw new NotFoundException(`Vehicle type with ID ${id} not found`);
    }

    return vehicleType;
  }

  async update(id: string, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    await this.findOne(id);

    return this.prisma.vehicleType.update({
      where: { id },
      data: updateVehicleTypeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vehicleType.delete({
      where: { id },
    });
  }
}
