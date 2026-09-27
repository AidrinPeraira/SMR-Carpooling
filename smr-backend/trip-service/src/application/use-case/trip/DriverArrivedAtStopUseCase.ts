import { DriverArrivedAtStopRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverArrivedAtStopUseCase } from "#/application/interfaces/use-case/trip/IDriverArrivedAtStopUseCase";
import { ARRIVAL_RANGE_METERS } from "#/domain/constants/journey";
import {
  ApplicationError,
  distanceInMeters,
  DriverArrivedAtStopEvent,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyStop,
  TripErrorMessage,
  TripStatus,
} from "@sharemyride/shared";

/**
 * This class implements the use case that handles
 * verifiying the driver has reached a stop in the journey
 */
export class DriverArrivedAtStopUseCase implements IDriverArrivedAtStopUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _journeyPassengerRepo: IJourneyPassengerRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(dto: DriverArrivedAtStopRequestDTO): Promise<void> {
    //finds the journey mathcing journey id.
    const journey = await this._journeyRepository.findById(dto.journeyId);
    if (!journey) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverArrivedAtStopUseCase",
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
          location: "DriverArrivedAtStopUseCase",
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
          location: "DriverArrivedAtStopUseCase",
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
          location: "DriverArrivedAtStopUseCase",
          description: `Passenger ${dto.passengerId} is not part of journey: ${journey.journeyId}`,
        },
      );
    }

    //find stop location matching the passenger and stop type
    const stopIndex = journey.intermediateStops.findIndex(
      (stop) =>
        stop.passengerId === dto.passengerId && stop.stopType === dto.stopType,
    );
    const stop = journey.intermediateStops[stopIndex];
    if (!stop) {
      throw new ApplicationError(
        TripErrorMessage.STOP_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverArrivedAtStopUseCase",
          description: `No '${dto.stopType}' stop for passenger ${dto.passengerId} in journey: ${journey.journeyId}`,
        },
      );
    }

    //return early if the stop is already marked arrived
    //the first arrival is the one that starts the passenger's wait
    if (stop.arrivedAt) return;

    //the driver has to be within range of the stop to mark it reached
    const distance = distanceInMeters(
      dto.driverLat,
      dto.driverLng,
      stop.stopLat,
      stop.stopLng,
    );
    if (distance > ARRIVAL_RANGE_METERS) {
      throw new ApplicationError(
        TripErrorMessage.TOO_FAR_FROM_STOP,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverArrivedAtStopUseCase",
          description: `Driver is ${Math.round(distance)}m from the stop, allowed range is ${ARRIVAL_RANGE_METERS}m`,
        },
      );
    }

    //update the arrived at time and the reported driver location
    const arrivedAt = new Date();
    const updatedStops: JourneyStop[] = journey.intermediateStops.map(
      (journeyStop, index) =>
        index === stopIndex
          ? {
              ...journeyStop,
              arrivedAt,
              arrivedLat: dto.driverLat,
              arrivedLng: dto.driverLng,
            }
          : journeyStop,
    );

    await this._journeyRepository.updateById(journey.journeyId, {
      intermediateStops: updatedStops,
      updatedAt: arrivedAt,
    });

    //emit the arrival event to notify the passenger
    const arrivedEvent: DriverArrivedAtStopEvent = {
      eventName: EventName.TRIP_DRIVER_ARRIVED_AT_STOP,
      timestamp: arrivedAt,
      payload: {
        journeyId: journey.journeyId,
        driverId: journey.driverId,
        passengerId: journeyPassenger.passengerId,
        passengerName: journeyPassenger.passengerName,
        stopType: stop.stopType,
        stopName: stop.stopName,
        arrivedAt,
      },
    };

    await this._eventBus.publish(arrivedEvent);
  }
}
