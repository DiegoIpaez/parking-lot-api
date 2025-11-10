import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateParkingSessionDto {
  @IsInt()
  @IsNotEmpty()
  vehicleId: number;

  @IsInt()
  @IsNotEmpty()
  parkingSpaceId: number;

  @IsInt()
  @IsNotEmpty()
  checkInUserId: number;
}
