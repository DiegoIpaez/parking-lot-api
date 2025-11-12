import { ParkingSessionStatus } from '@prisma/client';
import { IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindParkingSessionsDto extends PaginationDto {
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
}
