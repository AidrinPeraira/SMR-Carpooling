/*
  Warnings:

  - The primary key for the `Places` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `placeIndex` on the `Places` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Places" DROP CONSTRAINT "Places_pkey",
DROP COLUMN "placeIndex",
ADD COLUMN     "placeIndex" BIGINT NOT NULL,
ALTER COLUMN "placeLat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "placeLng" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Places_pkey" PRIMARY KEY ("placeIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Places_placeIndex_key" ON "Places"("placeIndex");
