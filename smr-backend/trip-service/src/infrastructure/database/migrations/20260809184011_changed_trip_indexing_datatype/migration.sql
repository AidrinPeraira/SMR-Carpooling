/*
  Warnings:

  - The primary key for the `Places` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TripPlaces` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "TripPlaces" DROP CONSTRAINT "TripPlaces_placeIndex_fkey";

-- AlterTable
ALTER TABLE "Places" DROP CONSTRAINT "Places_pkey",
ALTER COLUMN "placeIndex" SET DATA TYPE TEXT,
ADD CONSTRAINT "Places_pkey" PRIMARY KEY ("placeIndex");

-- AlterTable
ALTER TABLE "TripPlaces" DROP CONSTRAINT "TripPlaces_pkey",
ALTER COLUMN "placeIndex" SET DATA TYPE TEXT,
ADD CONSTRAINT "TripPlaces_pkey" PRIMARY KEY ("tripId", "placeIndex", "seqNumber");

-- AddForeignKey
ALTER TABLE "TripPlaces" ADD CONSTRAINT "TripPlaces_placeIndex_fkey" FOREIGN KEY ("placeIndex") REFERENCES "Places"("placeIndex") ON DELETE RESTRICT ON UPDATE CASCADE;
