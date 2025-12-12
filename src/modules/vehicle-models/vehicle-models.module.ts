import { Module } from '@nestjs/common';
import { VehicleModelsService } from './vehicle-models.service';
import { VehicleModelsController } from './vehicle-models.controller';

@Module({
  controllers: [VehicleModelsController],
  providers: [VehicleModelsService],
  exports: [VehicleModelsService],
})
export class VehicleModelsModule {}
