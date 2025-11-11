import { ParkingSessionStatus } from '@prisma/client';
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
import { CreateParkingSessionDto } from './dto/create-parking-session.dto';
import { CheckoutParkingSessionDto } from './dto/checkout-parking-session.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

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
  findAll(
    @Query('status') status?: ParkingSessionStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.parkingSessionsService.findAll(status, start, end);
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
