import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { FindVehicleBrandsDto } from './dto/find-vehicle-brands.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly service: VehicleBrandsService) {}

  @Get()
  findAll(@Query() query: FindVehicleBrandsDto) {
    return this.service.findAll(query);
  }
}
