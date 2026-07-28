-- CreateEnum
CREATE TYPE "VehicleTypes" AS ENUM ('sedan', 'suv', 'hatchback');

-- CreateTable
CREATE TABLE "VehicleList" (
    "id" TEXT NOT NULL,
    "vehicleType" "VehicleTypes" NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "VehicleList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingRules" (
    "id" TEXT NOT NULL,
    "vehicleType" "VehicleTypes" NOT NULL,
    "pricePerKm" DOUBLE PRECISION NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "PricingRules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleList_vehicleType_vehicleMake_vehicleModel_key" ON "VehicleList"("vehicleType", "vehicleMake", "vehicleModel");

-- CreateIndex
CREATE UNIQUE INDEX "PricingRules_vehicleType_key" ON "PricingRules"("vehicleType");
