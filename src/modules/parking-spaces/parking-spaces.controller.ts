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
  Query,
} from '@nestjs/common';
import { ParkingSpacesService } from './parking-spaces.service';
import { CreateParkingSpaceDto } from './dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from './dto/update-parking-space.dto';
import { ParkingSpaceStatus } from '@prisma/client';

@Controller('parking-spaces')
export class ParkingSpacesController {
  constructor(private readonly parkingSpacesService: ParkingSpacesService) {}

  @Post()
  create(@Body() createParkingSpaceDto: CreateParkingSpaceDto) {
    return this.parkingSpacesService.create(createParkingSpaceDto);
  }

  @Get()
  findAll(
    @Query('sectorId') sectorId?: number,
    @Query('status') status?: ParkingSpaceStatus
  ) {
    return this.parkingSpacesService.findAll(sectorId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.parkingSpacesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateParkingSpaceDto: UpdateParkingSpaceDto
  ) {
    return this.parkingSpacesService.update(id, updateParkingSpaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.parkingSpacesService.remove(id);
  }
}
