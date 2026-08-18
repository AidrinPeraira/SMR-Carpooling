import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IWithdrawBookingUseCase } from "#/application/interfaces/use-case/booking/IWithdrawBookingUseCase";
import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * Use case to withdraw/cancel a pending booking request by a passenger.
 * Only bookings in REQUESTED status can be withdrawn by the passenger who created them.
 */
export class WithdrawBookingUseCase implements IWithdrawBookingUseCase {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, passengerId: string): Promise<void> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new ApplicationError(
        BookingErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "WithdrawBookingUseCase",
          description: `Booking not found with bookingId: ${bookingId}`,
        },
      );
    }

    if (booking.passengerId !== passengerId) {
      throw new ApplicationError(
        BookingErrorMessage.UNAUTHORIZED_PASSENGER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "WithdrawBookingUseCase",
          description: `Booking does not belong to passenger: ${passengerId}`,
        },
      );
    }

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new ApplicationError(
        BookingErrorMessage.INVALID_STATUS_TRANSITION,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "WithdrawBookingUseCase",
          description: `Booking status is '${booking.status}', expected '${BookingStatus.REQUESTED}'`,
        },
      );
    }

    await this._bookingRepository.update(bookingId, {
      status: BookingStatus.CANCELLED,
    });
  }
}
