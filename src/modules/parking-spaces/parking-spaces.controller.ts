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
  UseGuards,
} from '@nestjs/common';
import { ParkingSpacesService } from './parking-spaces.service';
import { FindParkingSpacesDto } from './dto/find-parking-spaces.dto';
import { CreateParkingSpaceDto } from './dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from './dto/update-parking-space.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('parking-spaces')
export class ParkingSpacesController {
  constructor(private readonly parkingSpacesService: ParkingSpacesService) {}

  @Post()
  create(@Body() createParkingSpaceDto: CreateParkingSpaceDto) {
    return this.parkingSpacesService.create(createParkingSpaceDto);
  }

  @Get()
  findAll(@Query() query: FindParkingSpacesDto) {
    return this.parkingSpacesService.findAll(query);
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
