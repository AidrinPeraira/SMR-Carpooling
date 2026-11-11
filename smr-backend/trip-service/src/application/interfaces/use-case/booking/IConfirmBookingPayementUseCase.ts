/**
 * This use case updates the bookings record when payment is successful
 */
export interface IConfirmBookingPaymentUseCase {
  execute(bookingId: string): Promise<void>;
}
