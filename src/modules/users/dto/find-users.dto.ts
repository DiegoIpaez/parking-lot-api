import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '@/utils/pagination/dto/pagination.dto';

export class FindUsersDto extends PaginationDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
