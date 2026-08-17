-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('requested', 'payment_pending', 'confirmed', 'rejected', 'withdrawn', 'cancelled');

-- CreateTable
CREATE TABLE "Bookings" (
    "bookingId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "pickupPlaceId" TEXT NOT NULL,
    "dropOffPlaceId" TEXT NOT NULL,
    "pickupPoint" JSONB NOT NULL,
    "dropOffPoint" JSONB NOT NULL,
    "distanceKm" INTEGER NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("bookingId")
);

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("passengerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("tripId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_pickupPlaceId_fkey" FOREIGN KEY ("pickupPlaceId") REFERENCES "Places"("placeIndex") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_dropOffPlaceId_fkey" FOREIGN KEY ("dropOffPlaceId") REFERENCES "Places"("placeIndex") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("vehicleId") ON DELETE RESTRICT ON UPDATE CASCADE;
