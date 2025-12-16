import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';
import { ParkingSpaceStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FindSectorsDto extends PaginationQueryDto {
  @IsEnum(ParkingSpaceStatus)
  @IsOptional()
  parkingSpaceStatus?: ParkingSpaceStatus;
}
