/*
  Warnings:

  - The values [completed] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Journey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JourneyPassenger` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('requested', 'payment_pending', 'payment_processing', 'payment_failed', 'confirmed', 'rejected', 'withdrawn', 'cancelled');
ALTER TABLE "Bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Journey" DROP CONSTRAINT "Journey_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Journey" DROP CONSTRAINT "Journey_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyPassenger" DROP CONSTRAINT "JourneyPassenger_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyPassenger" DROP CONSTRAINT "JourneyPassenger_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyPassenger" DROP CONSTRAINT "JourneyPassenger_passengerId_fkey";

-- DropTable
DROP TABLE "Journey";

-- DropTable
DROP TABLE "JourneyPassenger";

-- DropEnum
DROP TYPE "PassengerRideStatus";
