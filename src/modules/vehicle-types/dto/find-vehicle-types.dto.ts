import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';

export class FindVehicleTypesDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  name: string;
}
