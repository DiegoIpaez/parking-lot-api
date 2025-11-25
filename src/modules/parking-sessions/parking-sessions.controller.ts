import { ApiBearerAuth } from '@nestjs/swagger';
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
import { ParkingSessionsService } from './parking-sessions.service';
import { FindParkingSessionsDto } from './dto/find-parking-sessions.dto';
import { CreateParkingSessionDto } from './dto/create-parking-session.dto';
import { CheckoutParkingSessionDto } from './dto/checkout-parking-session.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('parking-sessions')
export class ParkingSessionsController {
  constructor(
    private readonly parkingSessionsService: ParkingSessionsService
  ) {}

  @Post()
  create(@Body() createParkingSessionDto: CreateParkingSessionDto) {
    return this.parkingSessionsService.create(createParkingSessionDto);
  }

  @Get()
  findAll(@Query() query: FindParkingSessionsDto) {
    return this.parkingSessionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.parkingSessionsService.findOne(id);
  }

  @Put(':id/checkout')
  checkout(
    @Param('id') id: number,
    @Body() checkoutDto: CheckoutParkingSessionDto
  ) {
    return this.parkingSessionsService.checkout(id, checkoutDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.parkingSessionsService.remove(id);
  }
}
