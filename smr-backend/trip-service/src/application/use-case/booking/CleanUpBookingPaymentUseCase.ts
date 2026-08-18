import { CleanUpBookingRequsetDTO } from "#/application/dto/booking/BookingPaymentsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { ICleanUpBookingPaymentUseCase } from "#/application/interfaces/use-case/booking/ICleanUpBookingPaymentUseCase";
import { BookingStatus } from "@sharemyride/shared";

/**
 * CleanUpBookingPaymentUseCase handles cleaning up and releasing reserved seats from trips
 * in case the booking payment times out or fails.
 */
export class CleanUpBookingPaymentUseCase implements ICleanUpBookingPaymentUseCase {
  constructor(
    private readonly _bookingRepository: IBookingRepository,
    private readonly _tripRepository: ITripRepository,
  ) {}

  /**
   * Performs idempotent cleanup check:
   * Only releases seats and marks booking CANCELLED if booking status is PAYMENT_PENDING
   * and paymentKey matches.
   *
   * @param dto Booking ID, trip ID, and payment key
   */
  async execute(dto: CleanUpBookingRequsetDTO): Promise<void> {
    const booking = await this._bookingRepository.findByBookingId(
      dto.bookingId,
    );

    if (
      !booking ||
      booking.status !== BookingStatus.PAYMENT_PROCESSING ||
      booking.paymentKey !== dto.paymentKey
    ) {
      return;
    }

    await this._tripRepository.atmoicReleaseSeat(dto.tripId, booking.seatCount);

    await this._bookingRepository.update(dto.bookingId, {
      status: BookingStatus.PAYMENT_FAILED,
      paymentKey: undefined,
      paymentKeyExpiry: undefined,
    });
  }
}
