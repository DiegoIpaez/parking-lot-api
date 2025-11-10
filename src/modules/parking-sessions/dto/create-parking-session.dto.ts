import { IsString, IsNotEmpty } from 'class-validator';

export class CreateParkingSessionDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  parkingSpaceId: string;

  @IsString()
  @IsNotEmpty()
  checkInUserId: string;
}
