import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VehicleTypesService } from './vehicle-types.service';
import { FindVehicleTypesDto } from './dto/find-vehicle-types.dto';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('vehicle-types')
export class VehicleTypesController {
  constructor(private readonly vehicleTypesService: VehicleTypesService) {}

  @Post()
  create(@Body() createVehicleTypeDto: CreateVehicleTypeDto) {
    return this.vehicleTypesService.create(createVehicleTypeDto);
  }

  @Get()
  findAll(@Query() query: FindVehicleTypesDto) {
    return this.vehicleTypesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.vehicleTypesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateVehicleTypeDto: UpdateVehicleTypeDto
  ) {
    return this.vehicleTypesService.update(id, updateVehicleTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.vehicleTypesService.remove(id);
  }
}
