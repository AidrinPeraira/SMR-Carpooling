import { DropOffRequestDTO } from "#/application/dto/journey/DropOffDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverVerifyPassengerDropOffUseCase } from "#/application/interfaces/use-case/journey/IDriverDropOffPassengerUseCase";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyErrorMessage,
  JourneyPassengerDroppedOffEventPayload,
  JourneyStatus,
  PassengerJourneyStatus,
  StopType,
} from "@sharemyride/shared";

const DROP_OFF_RANGE_METERS = 500;

/**
 * Verifies that the driver is within range of the
 * drop-off stop and marks the passenger as dropped off.
 * Updates booking status and publishes event to remove
 * passenger from live tracking.
 */
export class DriverDropOffPassengerUseCase implements IDriverVerifyPassengerDropOffUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _bookingRepository: IBookingRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(dto: DropOffRequestDTO, driverId: string): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(dto.journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverDropOffPassengerUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    if (journey.driverId !== driverId) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_DRIVER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverDropOffPassengerUseCase",
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
          location: "DriverDropOffPassengerUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${JourneyStatus.ONGOING}'`,
        },
      );
    }

    const passenger = journeyPassengers.find(
      (p) => p.passengerId === dto.passengerId,
    );

    if (!passenger) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverDropOffPassengerUseCase",
          description: `Passenger ${dto.passengerId} is not part of journey: ${dto.journeyId}`,
        },
      );
    }

    if (passenger.passengerStatus !== PassengerJourneyStatus.PICKED_UP) {
      if (passenger.passengerStatus === PassengerJourneyStatus.DROPPED_OFF) {
        throw new ApplicationError(
          JourneyErrorMessage.PASSENGER_ALREADY_DROPPED_OFF,
          HttpStatusCodes.BadRequest,
          ErrorCode.DOMAIN_CONFLICT,
          ErrorDetails.DOMAIN_CONFLICT,
          {
            location: "DriverDropOffPassengerUseCase",
            description: `Passenger ${dto.passengerId} has already been dropped off`,
          },
        );
      }
      throw new ApplicationError(
        JourneyErrorMessage.PASSENGER_NOT_BOARDED,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverDropOffPassengerUseCase",
          description: `Passenger ${dto.passengerId} status is '${passenger.passengerStatus}', expected '${PassengerJourneyStatus.PICKED_UP}'`,
        },
      );
    }

    const dropOffStop = journey.intermediateStops.find(
      (s) =>
        s.passengerId === dto.passengerId && s.stopType === StopType.DROPOFF,
    );

    if (dropOffStop) {
      const distance = this._haversineMeters(
        dto.dropOffLat,
        dto.dropOffLng,
        dropOffStop.stopLat,
        dropOffStop.stopLng,
      );

      if (distance > DROP_OFF_RANGE_METERS) {
        throw new ApplicationError(
          JourneyErrorMessage.DRIVER_NOT_IN_RANGE,
          HttpStatusCodes.BadRequest,
          ErrorCode.DOMAIN_CONFLICT,
          ErrorDetails.DOMAIN_CONFLICT,
          {
            location: "DriverDropOffPassengerUseCase",
            description: `Driver is ${Math.round(distance)}m from drop-off, max allowed is ${DROP_OFF_RANGE_METERS}m`,
          },
        );
      }
    }

    await this._journeyRepository.updateJourneyPassenger(
      dto.journeyId,
      dto.passengerId,
      {
        passengerStatus: PassengerJourneyStatus.DROPPED_OFF,
        dropoffTime: dto.dropOffTime,
      },
    );

    await this._journeyRepository.updateJourneyStop(
      dto.journeyId,
      dto.passengerId,
      StopType.DROPOFF,
      {
        arrivedAt: dto.dropOffTime,
        arrivedLat: dto.dropOffLat,
        arrivedLng: dto.dropOffLng,
      },
    );

    const updatedBooking = await this._bookingRepository.update(
      passenger.bookingId,
      { status: BookingStatus.COMPLETED },
    );

    await this._eventBus.publish<JourneyPassengerDroppedOffEventPayload>({
      eventName: EventName.JOURNEY_PASSENGER_DROPPED_OFF,
      timestamp: new Date(),
      payload: {
        journey_id: dto.journeyId,
        driver_id: driverId,
        passenger_id: dto.passengerId,
        booking_id: passenger.bookingId,
        amount: updatedBooking.totalPrice,
      },
    });
  }

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
