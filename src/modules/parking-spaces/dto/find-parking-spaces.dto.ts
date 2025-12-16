import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateParkingSpaceDto } from './create-parking-space.dto';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';

export class FindParkingSpacesDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(CreateParkingSpaceDto)
) {}
