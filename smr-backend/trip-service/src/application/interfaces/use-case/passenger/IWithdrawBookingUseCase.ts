/**
 * This use case allows the passenger to withdraw a booking
 * made to join a trip.
 */
export interface IWithdrawBookingUseCase {
  execute(bookingId: string, passengerId: string): Promise<void>;
}
