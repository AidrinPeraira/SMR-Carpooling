-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('scheduled', 'fully_booked', 'cancelled', 'ongoing', 'completed');

-- CreateTable
CREATE TABLE "Trip" (
    "tripId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "tripOrigin" JSONB NOT NULL,
    "tripDestination" JSONB NOT NULL,
    "tripStops" JSONB NOT NULL,
    "tripRoute" JSONB NOT NULL,
    "tripDistance" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "vacantSeats" INTEGER NOT NULL,
    "tripTags" TEXT[],
    "startTime" TIMESTAMP(3) NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "tripStatus" "TripStatus" NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("tripId")
);

-- CreateTable
CREATE TABLE "TripPlaces" (
    "placeIndex" BIGINT NOT NULL,
    "tripId" TEXT NOT NULL,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "seqNumber" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TripPlaces_pkey" PRIMARY KEY ("tripId","placeIndex","seqNumber")
);

-- CreateIndex
CREATE INDEX "TripPlaces_placeIndex_tripDate_idx" ON "TripPlaces"("placeIndex", "tripDate");

-- CreateIndex
CREATE INDEX "TripPlaces_tripId_idx" ON "TripPlaces"("tripId");

-- AddForeignKey
ALTER TABLE "TripPlaces" ADD CONSTRAINT "TripPlaces_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("tripId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlaces" ADD CONSTRAINT "TripPlaces_placeIndex_fkey" FOREIGN KEY ("placeIndex") REFERENCES "Places"("placeIndex") ON DELETE RESTRICT ON UPDATE CASCADE;
