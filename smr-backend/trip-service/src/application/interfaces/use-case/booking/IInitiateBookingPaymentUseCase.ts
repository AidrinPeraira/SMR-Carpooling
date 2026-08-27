import { InitaiteBookingPaymentResponseDTO } from "#/application/dto/booking/BookingPaymentsDTO";

/**
 * This use case reserves a seat for processing payment and updates booking
 * record with idempotency key of current transaction.
 *
 * It also sets a scheduled job for rollback on no completion update
 */
export interface IInitiateBookingPaymentUseCase {
  execute(
    bookingId: string,
    passengerId: string,
  ): Promise<InitaiteBookingPaymentResponseDTO>;
}
