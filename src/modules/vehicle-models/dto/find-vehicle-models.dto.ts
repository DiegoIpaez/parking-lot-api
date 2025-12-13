import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindVehicleModelsDto extends PaginationDto {
  @IsInt()
  @IsOptional()
  vehicleBrandId?: number;
}
