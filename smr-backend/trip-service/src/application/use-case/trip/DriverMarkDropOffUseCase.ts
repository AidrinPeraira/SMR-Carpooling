import { DriverMarkDropOffRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";
import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverMarkDropOffUseCase } from "#/application/interfaces/use-case/trip/IDriverMarkDropOffUseCase";
import { ARRIVAL_RANGE_METERS } from "#/domain/constants/journey";
import {
  ApplicationError,
  distanceInMeters,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PassengerRideStatus,
  StopType,
  TripErrorMessage,
  TripStatus,
} from "@sharemyride/shared";

/**
 * This class implements the use case that marks a passenger as
 * dropped off at their drop off stop
 */
export class DriverMarkDropOffUseCase implements IDriverMarkDropOffUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _journeyPassengerRepo: IJourneyPassengerRepository,
  ) {}

  async execute(dto: DriverMarkDropOffRequestDTO): Promise<void> {
    //finds the journey mathcing journey id.
    const journey = await this._journeyRepository.findById(dto.journeyId);
    if (!journey) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverMarkDropOffUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    //verify the driver id
    if (journey.driverId !== dto.driverId) {
      throw new ApplicationError(
        TripErrorMessage.UNAUTHORIZED_JOURNEY,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverMarkDropOffUseCase",
          description: `Journey does not belong to driver: ${dto.driverId}`,
        },
      );
    }

    //verify the journey is still ongoing
    if (journey.journeyStatus !== TripStatus.ONGOING) {
      throw new ApplicationError(
        TripErrorMessage.JOURNEY_NOT_ONGOING,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverMarkDropOffUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${TripStatus.ONGOING}'`,
        },
      );
    }

    //verify the passenger belongs to the journey
    const journeyPassengers = await this._journeyPassengerRepo.findByJourneyId(
      journey.journeyId,
    );
    const journeyPassenger = journeyPassengers.find(
      (passenger) => passenger.passengerId === dto.passengerId,
    );
    if (!journeyPassenger) {
      throw new ApplicationError(
        TripErrorMessage.PASSENGER_NOT_IN_JOURNEY,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverMarkDropOffUseCase",
          description: `Passenger ${dto.passengerId} is not part of journey: ${journey.journeyId}`,
        },
      );
    }

    //only a passenger already in the vehicle can be dropped off
    if (journeyPassenger.passengerStatus !== PassengerRideStatus.PICKED_UP) {
      throw new ApplicationError(
        TripErrorMessage.PASSENGER_NOT_PICKED_UP,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverMarkDropOffUseCase",
          description: `Passenger status is '${journeyPassenger.passengerStatus}', expected '${PassengerRideStatus.PICKED_UP}'`,
        },
      );
    }

    //the driver has to be within range of the drop off stop
    const distance = distanceInMeters(
      dto.driverLat,
      dto.driverLng,
      journeyPassenger.dropOffLocation.stopLat,
      journeyPassenger.dropOffLocation.stopLng,
    );
    if (distance > ARRIVAL_RANGE_METERS) {
      throw new ApplicationError(
        TripErrorMessage.TOO_FAR_FROM_STOP,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverMarkDropOffUseCase",
          description: `Driver is ${Math.round(distance)}m from the ${StopType.DROP_OFF} stop, allowed range is ${ARRIVAL_RANGE_METERS}m`,
        },
      );
    }

    await this._journeyPassengerRepo.updateById(
      journeyPassenger.journeyPassengerId,
      {
        passengerStatus: PassengerRideStatus.DROPPED_OFF,
        dropoffTime: new Date(),
      },
    );
  }
}
