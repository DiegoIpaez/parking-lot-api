import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  disabled: boolean;
}
