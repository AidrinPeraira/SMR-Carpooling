import { DropOffRequestDTO } from "#/application/dto/journey/DropOffDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IPassengerConfirmDropOffUseCase } from "#/application/interfaces/use-case/journey/IPassengerConfirmDropOffUseCase";
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

/**
 * Confirms passenger drop-off via passenger request
 * (for a different drop-off location), or skips if
 * the driver already completed the drop-off. Updates
 * booking status and publishes event to remove
 * passenger from live tracking.
 */
export class PassengerConfirmDropOffUseCase implements IPassengerConfirmDropOffUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _bookingRepository: IBookingRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(dto: DropOffRequestDTO, passengerId: string): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(dto.journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "PassengerConfirmDropOffUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    if (journey.journeyStatus !== JourneyStatus.ONGOING) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_ACTIVE,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "PassengerConfirmDropOffUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${JourneyStatus.ONGOING}'`,
        },
      );
    }

    const passenger = journeyPassengers.find(
      (p) => p.passengerId === passengerId,
    );

    if (!passenger) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "PassengerConfirmDropOffUseCase",
          description: `Passenger ${passengerId} is not part of journey: ${dto.journeyId}`,
        },
      );
    }

    if (passenger.passengerStatus === PassengerJourneyStatus.DROPPED_OFF) {
      return;
    }

    if (passenger.passengerStatus !== PassengerJourneyStatus.PICKED_UP) {
      throw new ApplicationError(
        JourneyErrorMessage.PASSENGER_NOT_BOARDED,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "PassengerConfirmDropOffUseCase",
          description: `Passenger ${passengerId} status is '${passenger.passengerStatus}', expected '${PassengerJourneyStatus.PICKED_UP}'`,
        },
      );
    }

    await this._journeyRepository.updateJourneyPassenger(
      dto.journeyId,
      passengerId,
      {
        passengerStatus: PassengerJourneyStatus.DROPPED_OFF,
        dropoffTime: dto.dropOffTime,
      },
    );

    await this._journeyRepository.updateJourneyStop(
      dto.journeyId,
      passengerId,
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
        driver_id: journey.driverId,
        passenger_id: passengerId,
        booking_id: passenger.bookingId,
        amount: updatedBooking.totalPrice,
      },
    });
  }
}
