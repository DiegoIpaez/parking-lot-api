import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@/providers/prisma/prisma.module';

import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { SectorsModule } from '@/modules/sectors/sectors.module';
import { VehiclesModule } from '@/modules/vehicles/vehicles.module';
import { VehicleTypesModule } from '@/modules/vehicle-types/vehicle-types.module';
import { VehicleBrandsModule } from '@/modules/vehicle-brands/vehicle-brands.module';
import { VehicleModelsModule } from '@/modules/vehicle-models/vehicle-models.module';
import { ParkingSpacesModule } from '@/modules/parking-spaces/parking-spaces.module';
import { ParkingSessionsModule } from '@/modules/parking-sessions/parking-sessions.module';
import { PaginationModule } from '@/interceptors/pagination/pagination.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 400,
          ttl: 60_000,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    VehicleTypesModule,
    VehicleBrandsModule,
    VehicleModelsModule,
    SectorsModule,
    ParkingSpacesModule,
    ParkingSessionsModule,
    PaginationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
