-- CreateTable
CREATE TABLE "Places" (
    "placeIndex" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "placeLat" INTEGER NOT NULL,
    "placeLng" INTEGER NOT NULL,
    "placeAddress" TEXT NOT NULL,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("placeIndex")
);

-- CreateIndex
CREATE UNIQUE INDEX "Places_placeIndex_key" ON "Places"("placeIndex");
