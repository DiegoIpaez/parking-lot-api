import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';
import { Type } from 'class-transformer';

export class FindVehicleModelsDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vehicleBrandId?: number;
}
