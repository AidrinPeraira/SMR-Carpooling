-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('active', 'inactive', 'blocked');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('active', 'inactive', 'blocked');

-- CreateTable
CREATE TABLE "Driver" (
    "driverId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL DEFAULT '',
    "licenseImage" TEXT NOT NULL DEFAULT '',
    "driverStatus" "DriverStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("driverId")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "vehicleType" "VehicleTypes" NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "vehicleCapacity" INTEGER NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "vehicleImage" TEXT NOT NULL,
    "vehicleStatus" "VehicleStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicleId")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("driverId") ON DELETE RESTRICT ON UPDATE CASCADE;
