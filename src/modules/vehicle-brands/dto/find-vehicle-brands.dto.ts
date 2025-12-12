import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindVehicleBrandsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  name?: string;
}
