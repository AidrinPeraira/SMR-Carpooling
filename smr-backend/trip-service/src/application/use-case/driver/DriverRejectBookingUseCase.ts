import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverRejectBookingUseCase } from "#/application/interfaces/use-case/driver/IDriverRejectBookingUseCase";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

/**
 * This use case rejects a passenger's booking request to join a trip.
 * Verifies booking existence, driver ownership, and updates status to REJECTED.
 */
export class DriverRejectBookingUseCase
  implements IDriverRejectBookingUseCase
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
          location: "DriverRejectBookingUseCase",
          description: `Booking not found with bookingId: ${bookingId}`,
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
          location: "DriverRejectBookingUseCase",
          description: `Trip not found or does not belong to driver: ${driverId}`,
        },
      );
    }

    await this._bookingRepository.updateStatus(
      bookingId,
      BookingStatus.REJECTED,
    );
  }
}
