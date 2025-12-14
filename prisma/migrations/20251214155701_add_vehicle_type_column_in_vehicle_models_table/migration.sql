/*
  Warnings:

  - You are about to drop the column `vehicleTypeId` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `vehicleTypeId` to the `vehicle_models` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_vehicleTypeId_fkey";

-- AlterTable
ALTER TABLE "vehicle_models" ADD COLUMN     "vehicleTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "vehicleTypeId";

-- AddForeignKey
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "vehicle_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
