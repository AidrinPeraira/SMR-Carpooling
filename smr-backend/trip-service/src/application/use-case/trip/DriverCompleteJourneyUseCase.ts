import { DriverCompleteJourneyRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverCompleteJourneyUseCase } from "#/application/interfaces/use-case/trip/IDriverCompleteJourneyUseCase";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PassengerRideStatus,
  TripErrorMessage,
  TripStatus,
} from "@sharemyride/shared";

/**
 * This class implements the use case that completes an ongoing
 * journey, the trip it tracks and the bookings that were served
 */
export class DriverCompleteJourneyUseCase
  implements IDriverCompleteJourneyUseCase
{
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _journeyPassengerRepo: IJourneyPassengerRepository,
    private readonly _tripRepository: ITripRepository,
    private readonly _bookingRepository: IBookingRepository,
  ) {}

  async execute(dto: DriverCompleteJourneyRequestDTO): Promise<void> {
    //finds the journey mathcing journey id.
    const journey = await this._journeyRepository.findById(dto.journeyId);
    if (!journey) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverCompleteJourneyUseCase",
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
          location: "DriverCompleteJourneyUseCase",
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
          location: "DriverCompleteJourneyUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${TripStatus.ONGOING}'`,
        },
      );
    }

    //a passenger still in the vehicle has to be dropped off first
    const journeyPassengers = await this._journeyPassengerRepo.findByJourneyId(
      journey.journeyId,
    );
    const onboardPassengers = journeyPassengers.filter(
      (passenger) =>
        passenger.passengerStatus === PassengerRideStatus.PICKED_UP,
    );
    if (onboardPassengers.length > 0) {
      throw new ApplicationError(
        TripErrorMessage.PASSENGERS_STILL_ONBOARD,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverCompleteJourneyUseCase",
          description: `${onboardPassengers.length} passenger(s) are still picked up in journey: ${journey.journeyId}`,
        },
      );
    }

    const now = new Date();

    await this._journeyRepository.updateById(journey.journeyId, {
      journeyStatus: TripStatus.COMPLETED,
      updatedAt: now,
    });

    //the journey id is the trip id of the trip being tracked
    await this._tripRepository.update(journey.journeyId, {
      tripStatus: TripStatus.COMPLETED,
    });

    //only the passengers that were actually carried get a completed booking
    const servedPassengers = journeyPassengers.filter(
      (passenger) =>
        passenger.passengerStatus === PassengerRideStatus.DROPPED_OFF,
    );

    for (const passenger of servedPassengers) {
      await this._bookingRepository.update(passenger.bookingId, {
        status: BookingStatus.COMPLETED,
      });
    }
  }
}
