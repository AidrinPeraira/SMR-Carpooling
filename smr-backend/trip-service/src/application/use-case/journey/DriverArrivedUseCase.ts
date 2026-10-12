import { DriverArrivedRequestDTO } from "#/application/dto/journey/DriverArrivedDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverArrivedUseCase } from "#/application/interfaces/use-case/journey/IDriverArrivedUseCase";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyDriverArrivedEventPayload,
  JourneyErrorMessage,
  JourneyStatus,
} from "@sharemyride/shared";

const ARRIVAL_RANGE_METERS = 500;

/**
 * Validates that the driver has arrived within
 * the designated range of a stop and records
 * the arrival coordinates and timestamp.
 */
export class DriverArrivedUseCase implements IDriverArrivedUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(dto: DriverArrivedRequestDTO, driverId: string): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(dto.journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverArrivedUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    const { journey } = result;

    if (journey.driverId !== driverId) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_DRIVER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverArrivedUseCase",
          description: `Journey does not belong to driver: ${driverId}`,
        },
      );
    }

    if (journey.journeyStatus !== JourneyStatus.ONGOING) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_ACTIVE,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverArrivedUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${JourneyStatus.ONGOING}'`,
        },
      );
    }

    const stop = journey.intermediateStops.find(
      (s) => s.passengerId === dto.passengerId && s.stopType === dto.stopType,
    );

    if (!stop) {
      throw new ApplicationError(
        JourneyErrorMessage.STOP_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverArrivedUseCase",
          description: `Stop not found for passenger ${dto.passengerId} with type ${dto.stopType}`,
        },
      );
    }

    const distance = this._haversineMeters(
      dto.arrivedLat,
      dto.arrivedLng,
      stop.stopLat,
      stop.stopLng,
    );

    if (distance > ARRIVAL_RANGE_METERS) {
      throw new ApplicationError(
        JourneyErrorMessage.DRIVER_NOT_IN_RANGE,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverArrivedUseCase",
          description: `Driver is ${Math.round(distance)}m from stop, max allowed is ${ARRIVAL_RANGE_METERS}m`,
        },
      );
    }

    await this._journeyRepository.updateJourneyStop(
      dto.journeyId,
      dto.passengerId,
      dto.stopType,
      {
        arrivedAt: dto.arrivedTime,
        arrivedLat: dto.arrivedLat,
        arrivedLng: dto.arrivedLng,
      },
    );

    await this._eventBus.publish<JourneyDriverArrivedEventPayload>({
      eventName: EventName.JOURNEY_DRIVER_ARRIVED,
      timestamp: new Date(),
      payload: {
        journey_id: dto.journeyId,
        driver_id: driverId,
        passenger_id: dto.passengerId,
        stop_type: dto.stopType,
      },
    });
  }

  /** Calculates distance between two coordinates in metres. */
  private _haversineMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6_371_000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
