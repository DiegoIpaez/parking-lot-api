import { Module } from '@nestjs/common';
import { ParkingSessionsController } from './parking-sessions.controller';
import { ParkingSessionsService } from './parking-sessions.service';

@Module({
  controllers: [ParkingSessionsController],
  providers: [ParkingSessionsService],
})
export class ParkingSessionsModule {}
