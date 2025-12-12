import { Module } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { VehicleBrandsController } from './vehicle-brands.controller';

@Module({
  controllers: [VehicleBrandsController],
  providers: [VehicleBrandsService],
  exports: [VehicleBrandsService],
})
export class VehicleBrandsModule {}
