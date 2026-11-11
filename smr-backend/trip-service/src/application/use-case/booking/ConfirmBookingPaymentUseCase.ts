import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IConfirmBookingPaymentUseCase } from "#/application/interfaces/use-case/booking/IConfirmBookingPayementUseCase";
import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * ConfirmBookingPaymentUseCase updates booking status to CONFIRMED when payment succeeds.
 */
export class ConfirmBookingPaymentUseCase implements IConfirmBookingPaymentUseCase {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  /**
   * Validates booking existence and status before marking as CONFIRMED.
   *
   * @param bookingId Booking ID to confirm
   */
  async execute(bookingId: string): Promise<void> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new ApplicationError(
        BookingErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ConfirmBookingPaymentUseCase",
          description: `Booking not found with bookingId: ${bookingId}`,
        },
      );
    }

    if (booking.status !== BookingStatus.PAYMENT_PROCESSING) {
      throw new ApplicationError(
        BookingErrorMessage.INVALID_STATUS_TRANSITION,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "ConfirmBookingPaymentUseCase",
          description: `Booking status is '${booking.status}', expected '${BookingStatus.PAYMENT_PROCESSING}'`,
        },
      );
    }

    await this._bookingRepository.update(bookingId, {
      status: BookingStatus.CONFIRMED,
    });
  }
}
