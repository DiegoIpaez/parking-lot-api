import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SectorsModule } from '../sectors/sectors.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { VehicleTypesModule } from '../vehicle-types/vehicle-types.module';
import { ParkingSpacesModule } from '../parking-spaces/parking-spaces.module';
import { ParkingSessionsModule } from '../parking-sessions/parking-sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SectorsModule,
    ParkingSpacesModule,
    VehicleTypesModule,
    VehiclesModule,
    UsersModule,
    AuthModule,
    ParkingSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
