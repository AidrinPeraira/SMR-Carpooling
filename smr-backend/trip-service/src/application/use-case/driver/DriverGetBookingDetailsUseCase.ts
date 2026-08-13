import { GetBookingDetailsResultDTO } from "#/application/dto/driver/BookingDetailsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { IDriverGetBookingDetailsUseCase } from "#/application/interfaces/use-case/driver/IDriverGetBookingDetailsUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

/**
 * Use case to get details of a specific booking for a driver.
 */
export class DriverGetBookingDetailsUseCase
  implements IDriverGetBookingDetailsUseCase
{
  constructor(
    private readonly _bookingRepository: IBookingRepository,
    private readonly _tripRepository: ITripRepository,
    private readonly _passengerRepository: IPassengerRepository,
    private readonly _vehicleRepository: IVehicleRepository,
  ) {}

  async execute(
    bookingId: string,
    driverId: string,
  ): Promise<GetBookingDetailsResultDTO> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverGetBookingDetailsUseCase",
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
          location: "DriverGetBookingDetailsUseCase",
          description: `Booking does not belong to driver: ${driverId}`,
        },
      );
    }

    const passenger = await this._passengerRepository.findByPassengerId(
      booking.passengerId,
    );
    const vehicle = await this._vehicleRepository.findByVehicleId(
      trip.vehicleId,
    );

    return {
      bookingId: booking.bookingId,
      passngerName: passenger
        ? `${passenger.firstName} ${passenger.lastName}`.trim()
        : "Passenger",
      tripDate: trip.startTime,
      tripVehicle: vehicle
        ? `${vehicle.vehicleMake} ${vehicle.vehicleModel}`.trim()
        : "Vehicle",
      tripRoute: trip.tripRoute,
      pickupPoint: booking.pickupPoint,
      dropOffPoint: booking.dropOffPoint,
      bookingDistance: booking.distanceKm,
      seatCount: booking.seatCount,
      status: booking.status,
      totalPrice: booking.totalPrice,
    };
  }
}
