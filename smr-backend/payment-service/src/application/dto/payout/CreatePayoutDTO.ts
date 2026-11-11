export interface CreatePayoutRequestDTO {
  journeyId: string;
  driverId: string;
  passengerId: string;
  bookingId: string;
  amount: number;
}
