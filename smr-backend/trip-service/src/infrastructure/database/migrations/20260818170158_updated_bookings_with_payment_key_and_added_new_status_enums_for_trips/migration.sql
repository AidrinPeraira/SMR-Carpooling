-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'payment_processing';
ALTER TYPE "BookingStatus" ADD VALUE 'payment_failed';

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "paymentKey" TEXT,
ADD COLUMN     "paymentKeyExpiry" TIMESTAMP(3);
