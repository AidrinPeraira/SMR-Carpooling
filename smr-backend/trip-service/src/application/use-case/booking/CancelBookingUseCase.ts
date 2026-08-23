import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { ICancelBookingUseCase } from "#/application/interfaces/use-case/booking/ICancelBookingUseCase";
import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  PassengerCancelBookingEvent,
} from "@sharemyride/shared";

/**
 * This class implements the use case that cancels the booking for a
 * confirmed and paid booking
 */
export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    private readonly _bookingRepository: IBookingRepository,
    private readonly _tripRepository: ITripRepository,
    private readonly _passengerRepository: IPassengerRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * This method finds the booking for the passenger
   * and check status if it is paid and cancels it
   * and publishes events for payment refund and notification
   *
   * @param bookingId  : ID of booking to cancel
   * @param passengerId  : ID of passenger
   */
  async execute(bookingId: string, passengerId: string): Promise<void> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new ApplicationError(
        BookingErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "CancelBookingUseCase",
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
          location: "CancelBookingUseCase",
          description: `Booking does not belong to passenger: ${passengerId}`,
        },
      );
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ApplicationError(
        BookingErrorMessage.INVALID_STATUS_TRANSITION,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "CancelBookingUseCase",
          description: `Booking status is '${booking.status}', expected '${BookingStatus.CONFIRMED}'`,
        },
      );
    }

    await this._bookingRepository.update(bookingId, {
      status: BookingStatus.CANCELLED,
    });

    await this._tripRepository.atmoicReleaseSeat(
      booking.tripId,
      booking.seatCount,
    );

    const passenger =
      await this._passengerRepository.findByPassengerId(passengerId);

    const cancelEvent: PassengerCancelBookingEvent = {
      eventName: EventName.BOOKING_CANCELLED_BY_PASSENGER,
      timestamp: new Date(),
      payload: {
        tripId: booking.tripId,
        bookingId: booking.bookingId,
        passengerId: passengerId,
        passengerName: passenger
          ? `${passenger.firstName} ${passenger.lastName}`.trim()
          : "Passenger",
        bookingStart: booking.pickupPoint.stopName,
        bookingStop: booking.dropOffPoint.stopName,
        amount: booking.totalPrice.toString(),
      },
    };

    await this._eventBus.publish(cancelEvent);
  }
}
