/*
  Warnings:

  - You are about to drop the column `brand` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `vehicleModelId` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "brand",
DROP COLUMN "color",
DROP COLUMN "model",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vehicleModelId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "vehicle_brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vehicleBrandId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_models_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_vehicleBrandId_fkey" FOREIGN KEY ("vehicleBrandId") REFERENCES "vehicle_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "vehicle_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
