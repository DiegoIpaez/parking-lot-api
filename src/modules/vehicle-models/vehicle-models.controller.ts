import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VehicleModelsService } from './vehicle-models.service';
import { FindVehicleModelsDto } from './dto/find-vehicle-models.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicle-models')
export class VehicleModelsController {
  constructor(private readonly service: VehicleModelsService) {}

  @Get()
  findAll(@Query() query: FindVehicleModelsDto) {
    return this.service.findAll(query);
  }
}
