import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsInt, IsString } from 'class-validator';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';

export class FindVehiclesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsInt()
  vehicleTypeId?: number;

  @IsOptional()
  @IsInt()
  vehicleModelId?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  notParked?: boolean;
}
