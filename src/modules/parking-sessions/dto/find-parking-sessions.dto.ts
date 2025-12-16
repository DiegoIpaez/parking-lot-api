import { ParkingSessionStatus } from '@prisma/client';
import {
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';

export class FindParkingSessionsDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt()
  vehicleId?: number;

  @IsOptional()
  @IsInt()
  parkingSpaceId?: number;

  @IsOptional()
  @IsInt()
  checkInUserId?: number;

  @IsOptional()
  @IsInt()
  checkOutUserId?: number;

  @IsOptional()
  @IsDateString()
  checkInTime?: string;

  @IsOptional()
  @IsDateString()
  checkOutTime?: string;

  @IsOptional()
  @IsEnum(ParkingSessionStatus)
  status?: ParkingSessionStatus;

  @IsString()
  @IsOptional()
  vehicleLicensePlate?: string;
}
