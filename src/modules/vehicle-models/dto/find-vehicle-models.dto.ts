import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindVehicleModelsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  vehicleBrandId?: number;
}
