import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ParkingSpaceStatus } from '@prisma/client';

export class CreateParkingSpaceDto {
  @IsInt()
  @Min(1)
  @Max(10)
  number: number;

  @IsString()
  @IsNotEmpty()
  sectorId: string;

  @IsEnum(ParkingSpaceStatus)
  @IsOptional()
  status?: ParkingSpaceStatus;
}
