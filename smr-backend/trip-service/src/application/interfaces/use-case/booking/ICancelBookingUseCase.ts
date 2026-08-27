/**
 * This is the use case that cancels booking for individual
 * passenger and publishes event for processing refund
 */
export interface ICancelBookingUseCase {
  execute(bookingId: string, passengerId: string): Promise<void>;
}
