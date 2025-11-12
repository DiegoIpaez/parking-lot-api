import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateParkingSpaceDto } from './create-parking-space.dto';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindParkingSpacesDto extends IntersectionType(
  PaginationDto,
  PartialType(CreateParkingSpaceDto)
) {}
