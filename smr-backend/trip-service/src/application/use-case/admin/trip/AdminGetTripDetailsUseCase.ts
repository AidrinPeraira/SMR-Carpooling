import { AdminGetTripDetailsResponseDTO } from "#/application/dto/admin/AdminTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IAdminGetTripDetailsUseCase } from "#/application/interfaces/use-case/admin/trip/IAdminGetTripDetailsUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

/**
 * This class implements the use case that gets details of single trip
 * aggregated / joined with booking, driver, and vehicle details
 */
export class AdminGetTripDetailsUseCase implements IAdminGetTripDetailsUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  /**
   * This method takes the trip id and gets the full trip details
   * aggregated with the booking, vehicle and driver tables
   *
   * @param tripId : ID of the trip
   * @returns Full trip details
   */
  async execute(tripId: string): Promise<AdminGetTripDetailsResponseDTO> {
    if (!this._tripRepository.findAdminTripDetails) {
      throw new Error("findAdminTripDetails method not implemented in repository");
    }
    const details = await this._tripRepository.findAdminTripDetails(tripId);

    if (!details) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "AdminGetTripDetailsUseCase",
          description: `Trip not found with tripId: ${tripId}`,
        },
      );
    }

    return details;
  }
}

