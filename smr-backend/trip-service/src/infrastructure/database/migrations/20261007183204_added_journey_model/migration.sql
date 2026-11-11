-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('ongoing', 'completed');

-- CreateEnum
CREATE TYPE "PassengerJourneyStatus" AS ENUM ('not_boarded', 'ended', 'picked_up', 'no_show', 'dropped_off');

-- CreateEnum
CREATE TYPE "StopType" AS ENUM ('pickup', 'dropoff');

-- CreateTable
CREATE TABLE "Journey" (
    "journeyId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "origin" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "journeyStatus" "JourneyStatus" NOT NULL DEFAULT 'ongoing',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("journeyId")
);

-- CreateTable
CREATE TABLE "JourneyPassenger" (
    "journeyId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "passengerName" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "passengerStatus" "PassengerJourneyStatus" NOT NULL DEFAULT 'not_boarded',
    "pickupLocation" JSONB NOT NULL,
    "dropOffLocation" JSONB NOT NULL,
    "pickupOTP" TEXT,
    "pickupTime" TIMESTAMP(3),
    "dropoffTime" TIMESTAMP(3),
    "pickupVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "JourneyPassenger_pkey" PRIMARY KEY ("journeyId","passengerId")
);

-- CreateTable
CREATE TABLE "JourneyStop" (
    "journeyId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "stopType" "StopType" NOT NULL,
    "stopLat" DOUBLE PRECISION NOT NULL,
    "stopLng" DOUBLE PRECISION NOT NULL,
    "stopName" TEXT NOT NULL,
    "stopAddress" TEXT NOT NULL,
    "arrivedAt" TIMESTAMP(3),
    "departedAt" TIMESTAMP(3),
    "arrivedLat" DOUBLE PRECISION,
    "arrivedLng" DOUBLE PRECISION,

    CONSTRAINT "JourneyStop_pkey" PRIMARY KEY ("journeyId","passengerId","stopType")
);

-- CreateIndex
CREATE UNIQUE INDEX "JourneyPassenger_bookingId_key" ON "JourneyPassenger"("bookingId");

-- CreateIndex
CREATE INDEX "JourneyStop_journeyId_idx" ON "JourneyStop"("journeyId");

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Trip"("tripId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPassenger" ADD CONSTRAINT "JourneyPassenger_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("journeyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPassenger" ADD CONSTRAINT "JourneyPassenger_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("passengerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPassenger" ADD CONSTRAINT "JourneyPassenger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStop" ADD CONSTRAINT "JourneyStop_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("journeyId") ON DELETE RESTRICT ON UPDATE CASCADE;
