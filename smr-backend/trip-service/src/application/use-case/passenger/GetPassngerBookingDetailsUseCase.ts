import { GetPassengerBookingDetailsResultDTO } from "#/application/dto/passenger/BookingDetailsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { IGetPassngerBookingDetailsUseCase } from "#/application/interfaces/use-case/passenger/IGetPassengerBookingDetailsUseCase";
import {
  ApplicationError,
  BookingErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * Use case to get details of a specific booking for a passenger.
 */
export class GetPassengerBookingDetailsUseCase
  implements IGetPassngerBookingDetailsUseCase
{
  constructor(
    private readonly _bookingRepository: IBookingRepository,
    private readonly _tripRepository: ITripRepository,
    private readonly _driverRepository: IDriverRepository,
    private readonly _vehicleRepository: IVehicleRepository,
  ) {}

  async execute(
    bookingId: string,
    passengerId: string,
  ): Promise<GetPassengerBookingDetailsResultDTO> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new ApplicationError(
        BookingErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetPassengerBookingDetailsUseCase",
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
          location: "GetPassengerBookingDetailsUseCase",
          description: `Booking does not belong to passenger: ${passengerId}`,
        },
      );
    }

    const trip = await this._tripRepository.findByTripId(booking.tripId);
    if (!trip) {
      throw new ApplicationError(
        BookingErrorMessage.TRIP_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetPassengerBookingDetailsUseCase",
          description: `Trip not found with tripId: ${booking.tripId}`,
        },
      );
    }

    const driver = await this._driverRepository.findByDriverId(trip.driverId);
    const vehicle = await this._vehicleRepository.findByVehicleId(trip.vehicleId);

    return {
      bookingId: booking.bookingId,
      driverName: driver
        ? `${driver.firstName} ${driver.lastName}`.trim()
        : "Driver",
      tripDate: trip.startTime,
      tripVehicle: vehicle
        ? `${vehicle.vehicleMake} ${vehicle.vehicleModel}`.trim()
        : "Vehicle",
      tirpVehicleImage: vehicle?.vehicleImage || "",
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
