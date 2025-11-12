import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';
import { ParkingSpaceStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindSectorsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ParkingSpaceStatus)
  @IsOptional()
  parkingSpaceStatus?: ParkingSpaceStatus;
}
