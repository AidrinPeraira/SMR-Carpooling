import { FailedBookingPaymentRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";

/**
 * This use case handles updating the booking payment status
 * to failed when the booking has not been confirmed in
 * a given time. (to be called by scheduled job)
 */
export interface IFailedBookingPaymentUseCase {
  execute(dto: FailedBookingPaymentRequestDTO): Promise<void>;
}
