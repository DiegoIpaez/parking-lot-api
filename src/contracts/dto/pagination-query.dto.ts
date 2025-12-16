import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  showAll: boolean = false;

  @IsString()
  @IsOptional()
  search?: string;
}
