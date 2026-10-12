import { JourneyEntity, JourneyStop } from "#/domain/entities/JourneyEntity";
import { JourneyPassengerEntity } from "#/domain/entities/JourneyPassenger";

/**
 * Repository interface that handles CRUD operations for journey aggregation root
 * (Journey Entity and Journey Stop and Journey Passengers)
 */
export interface IJourneyRepository {
  createJourney(
    journey: JourneyEntity,
    journeyPassengers: JourneyPassengerEntity[],
  ): Promise<{
    journey: JourneyEntity;
    journeyPassengers: JourneyPassengerEntity[];
  }>;

  findJourneyByPassengerId(
    passengerId: string,
  ): Promise<{
    journey: JourneyEntity;
    journeyPassenger: JourneyPassengerEntity;
  } | null>;

  findJourneyById(
    journeyId: string,
  ): Promise<{
    journey: JourneyEntity;
    journeyPassengers: JourneyPassengerEntity[];
  } | null>;

  updateJourney(
    journeyId: string,
    journey: Partial<JourneyEntity>,
  ): Promise<JourneyEntity>;

  updateJourneyPassenger(
    journeyId: string,
    passengerId: string,
    journeyPassenger: Partial<JourneyPassengerEntity>,
  ): Promise<JourneyPassengerEntity>;

  findJourneyPassenger(
    journeyId: string,
    passengerId: string,
  ): Promise<JourneyPassengerEntity | null>;

  updateJourneyStop(
    journeyId: string,
    passengerId: string,
    stopType: string,
    stop: Partial<JourneyStop>,
  ): Promise<void>;
}
