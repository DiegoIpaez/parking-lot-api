/*
  Warnings:

  - The primary key for the `parking_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `parking_sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checkOutUserId` column on the `parking_sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `parking_spaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `parking_spaces` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `sectors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `sectors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `vehicle_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `vehicle_types` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `vehicles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `vehicles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `vehicleId` on the `parking_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `parkingSpaceId` on the `parking_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `checkInUserId` on the `parking_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sectorId` on the `parking_spaces` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicleTypeId` on the `vehicles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "parking_sessions" DROP CONSTRAINT "parking_sessions_checkInUserId_fkey";

-- DropForeignKey
ALTER TABLE "parking_sessions" DROP CONSTRAINT "parking_sessions_checkOutUserId_fkey";

-- DropForeignKey
ALTER TABLE "parking_sessions" DROP CONSTRAINT "parking_sessions_parkingSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "parking_sessions" DROP CONSTRAINT "parking_sessions_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "parking_spaces" DROP CONSTRAINT "parking_spaces_sectorId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_vehicleTypeId_fkey";

-- AlterTable
ALTER TABLE "parking_sessions" DROP CONSTRAINT "parking_sessions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER NOT NULL,
DROP COLUMN "parkingSpaceId",
ADD COLUMN     "parkingSpaceId" INTEGER NOT NULL,
DROP COLUMN "checkInUserId",
ADD COLUMN     "checkInUserId" INTEGER NOT NULL,
DROP COLUMN "checkOutUserId",
ADD COLUMN     "checkOutUserId" INTEGER,
ADD CONSTRAINT "parking_sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "parking_spaces" DROP CONSTRAINT "parking_spaces_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "sectorId",
ADD COLUMN     "sectorId" INTEGER NOT NULL,
ADD CONSTRAINT "parking_spaces_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sectors" DROP CONSTRAINT "sectors_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "sectors_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vehicle_types" DROP CONSTRAINT "vehicle_types_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "vehicle_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vehicleTypeId",
ADD COLUMN     "vehicleTypeId" INTEGER NOT NULL,
ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "parking_spaces" ADD CONSTRAINT "parking_spaces_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "vehicle_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "parking_spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_checkInUserId_fkey" FOREIGN KEY ("checkInUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_checkOutUserId_fkey" FOREIGN KEY ("checkOutUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
