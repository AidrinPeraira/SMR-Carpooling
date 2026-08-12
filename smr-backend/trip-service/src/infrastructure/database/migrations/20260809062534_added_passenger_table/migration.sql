-- CreateTable
CREATE TABLE "Passenger" (
    "passengerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("passengerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_passengerId_key" ON "Passenger"("passengerId");
