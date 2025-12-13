import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsInt, IsString } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindVehiclesDto extends PaginationDto {
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
