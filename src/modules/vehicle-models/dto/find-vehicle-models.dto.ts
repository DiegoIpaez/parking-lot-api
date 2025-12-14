import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';
import { Type } from 'class-transformer';

export class FindVehicleModelsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vehicleBrandId?: number;
}
