/*
  Warnings:

  - A unique constraint covering the columns `[licenseNumber]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "licenseNumber" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registrationNumber_key" ON "Vehicle"("registrationNumber");
