import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindVehiclesDto extends IntersectionType(
  PaginationDto,
  PartialType(CreateVehicleDto)
) {}
