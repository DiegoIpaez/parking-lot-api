import { Controller, Get, Query } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { FindVehicleBrandsDto } from './dto/find-vehicle-brands.dto';

@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly service: VehicleBrandsService) {}

  @Get()
  findAll(@Query() query: FindVehicleBrandsDto) {
    return this.service.findAll(query);
  }
}
