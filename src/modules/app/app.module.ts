import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { SectorsModule } from '@/modules/sectors/sectors.module';
import { VehiclesModule } from '@/modules/vehicles/vehicles.module';
import { VehicleTypesModule } from '@/modules/vehicle-types/vehicle-types.module';
import { ParkingSpacesModule } from '@/modules/parking-spaces/parking-spaces.module';
import { ParkingSessionsModule } from '@/modules/parking-sessions/parking-sessions.module';
import { PrismaModule } from '@/services/prisma/prisma.module';

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
