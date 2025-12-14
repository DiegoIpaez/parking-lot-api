import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsInt()
  @IsNotEmpty()
  vehicleModelId: number;
}
