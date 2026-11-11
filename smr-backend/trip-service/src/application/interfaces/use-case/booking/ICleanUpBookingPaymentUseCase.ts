import { CleanUpBookingRequsetDTO } from "#/application/dto/booking/BookingPaymentsDTO";

/**
 * This use case handles cleaning up and releasing reserved seats from trips
 * in case the booking payment fails. If the payment had succeeded it drops the
 * event
 */
export interface ICleanUpBookingPaymentUseCase {
  execute(dto: CleanUpBookingRequsetDTO): Promise<void>;
}
