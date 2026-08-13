import { DriverGetTripDetailsResponseDTO } from "#/application/dto/driver/DriverTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverGetTripDetailsUseCase } from "#/application/interfaces/use-case/driver/IDriverTripDetailsUseCase";
import {
  ApplicationError,
  BookingErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

/**
 * Use case to get full trip details for a driver.
 * Verifies trip existence and driver ownership.
 */
export class DriverGetTripDetailsUseCase
  implements IDriverGetTripDetailsUseCase
{
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(
    tripId: string,
    driverId: string,
  ): Promise<DriverGetTripDetailsResponseDTO> {
    const payload = await this._tripRepository.findTripDetails(tripId);

    if (!payload || !payload.tripDetails) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverGetTripDetailsUseCase",
          description: `Trip not found with tripId: ${tripId}`,
        },
      );
    }

    if (payload.tripDetails.driverId !== driverId) {
      throw new ApplicationError(
        BookingErrorMessage.UNAUTHORIZED_DRIVER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverGetTripDetailsUseCase",
          description: `Trip ${tripId} does not belong to driver: ${driverId}`,
        },
      );
    }

    const { tripDetails, vehicleDetails, bookingDetails } = payload;

    return {
      tripDate: tripDetails.startTime,
      tripVehicle: `${vehicleDetails.vehicleMake} ${vehicleDetails.vehicleModel}`,
      tirpVehicleImage: vehicleDetails.vehicleImage || "",
      tripRoute: tripDetails.tripRoute as any,
      tripOrigin: tripDetails.tripOrigin,
      tripDestination: tripDetails.tripDestination,
      tripStops: tripDetails.tripStops,
      startTime: tripDetails.startTime,
      tripStatus: tripDetails.tripStatus,
      tripBookings: bookingDetails.map((b) => ({
        bookingId: b.bookingId,
        passengerName: b.passengerName || "Passenger",
        bookingStatus: b.status,
        seatCount: b.seatCount,
      })),
    };
  }
}
