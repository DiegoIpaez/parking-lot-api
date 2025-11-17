import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';
import { CreateVehicleDto } from './create-vehicle.dto';

export class FindVehiclesDto extends IntersectionType(
  PaginationDto,
  PartialType(CreateVehicleDto)
) {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  notParked?: boolean;
}
