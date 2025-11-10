import { IsNotEmpty, IsInt } from 'class-validator';

export class CheckoutParkingSessionDto {
  @IsInt()
  @IsNotEmpty()
  checkOutUserId: number;
}
