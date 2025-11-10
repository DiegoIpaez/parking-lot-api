import { IsString, IsNotEmpty } from 'class-validator';

export class CheckoutParkingSessionDto {
  @IsString()
  @IsNotEmpty()
  checkOutUserId: string;
}
