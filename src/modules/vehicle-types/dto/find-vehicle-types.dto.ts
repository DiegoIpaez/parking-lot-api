import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindVehicleTypesDto extends PaginationDto {
  @IsString()
  @IsOptional()
  name: string;
}
