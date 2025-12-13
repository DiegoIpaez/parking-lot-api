import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';
import { ParkingSpaceStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FindSectorsDto extends PaginationDto {
  @IsEnum(ParkingSpaceStatus)
  @IsOptional()
  parkingSpaceStatus?: ParkingSpaceStatus;
}
