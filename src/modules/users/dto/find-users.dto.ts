import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';

export class FindUsersDto extends PaginationQueryDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
