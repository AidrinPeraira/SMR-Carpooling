-- CreateEnum
CREATE TYPE "PassengerRideStatus" AS ENUM ('waiting', 'picked_up', 'no_show', 'droopped_off');

-- CreateTable
CREATE TABLE "Journey" (
    "journeyId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "origin" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "intermediateStops" JSONB NOT NULL,
    "journeyStatus" "TripStatus" NOT NULL DEFAULT 'ongoing',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("journeyId")
);

-- CreateTable
CREATE TABLE "JourneyPassenger" (
    "journeyPassengerId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "passengerName" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "passengerStatus" "PassengerRideStatus" NOT NULL DEFAULT 'waiting',
    "pickupLocation" JSONB NOT NULL,
    "dropOffLocation" JSONB NOT NULL,
    "pickupOTP" TEXT,
    "pickupTime" TIMESTAMP(3),
    "dropoffTime" TIMESTAMP(3),
    "pickupVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "JourneyPassenger_pkey" PRIMARY KEY ("journeyPassengerId")
);

-- CreateIndex
CREATE INDEX "Journey_driverId_journeyStatus_idx" ON "Journey"("driverId", "journeyStatus");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyPassenger_bookingId_key" ON "JourneyPassenger"("bookingId");

-- CreateIndex
CREATE INDEX "JourneyPassenger_journeyId_idx" ON "JourneyPassenger"("journeyId");

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Trip"("tripId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("driverId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPassenger" ADD CONSTRAINT "JourneyPassenger_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("passengerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPassenger" ADD CONSTRAINT "JourneyPassenger_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("journeyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPassenger" ADD CONSTRAINT "JourneyPassenger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;
