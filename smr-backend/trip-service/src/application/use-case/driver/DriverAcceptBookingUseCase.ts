import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverAcceptBookingUseCase } from "#/application/interfaces/use-case/driver/IDriverAcceptBookingUseCase";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

/**
 * This use case accepts a passenger's booking request to join a trip.
 * Verifies booking status, driver ownership, seat availability, and sets status to payment_pending.
 */
export class DriverAcceptBookingUseCase
  implements IDriverAcceptBookingUseCase
{
  constructor(
    private readonly _bookingRepository: IBookingRepository,
    private readonly _tripRepository: ITripRepository,
  ) {}

  async execute(bookingId: string, driverId: string): Promise<void> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverAcceptBookingUseCase",
          description: `Booking not found with bookingId: ${bookingId}`,
        },
      );
    }

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new ApplicationError(
        TripErrorMessage.CANNOT_JOIN,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverAcceptBookingUseCase",
          description: `Booking status is '${booking.status}', expected '${BookingStatus.REQUESTED}'`,
        },
      );
    }

    const trip = await this._tripRepository.findByTripId(booking.tripId);

    if (!trip || trip.driverId !== driverId) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverAcceptBookingUseCase",
          description: `Trip not found or does not belong to driver: ${driverId}`,
        },
      );
    }

    if (trip.vacantSeats < booking.seatCount) {
      throw new ApplicationError(
        TripErrorMessage.TRIP_FULL,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverAcceptBookingUseCase",
          description: `Requested seats (${booking.seatCount}) exceed available vacant seats (${trip.vacantSeats})`,
        },
      );
    }

    await this._bookingRepository.updateStatus(
      bookingId,
      BookingStatus.PAYMENT_PENDING,
    );
  }
}
