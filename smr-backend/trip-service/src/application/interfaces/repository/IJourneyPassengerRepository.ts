import { JourneyPassengerEntity } from "#/domain/entities/JourneyPassengerEntity";

/**
 * This repository handles mutations for journey entity
 * It handles CRUD and complex queries as needed
 */
export interface IJourneyPassengerRepository {
  save(driver: JourneyPassengerEntity): Promise<JourneyPassengerEntity>;
  updateById(
    journeyPassengerId: string,
    data: Partial<JourneyPassengerEntity>,
  ): Promise<JourneyPassengerEntity>;
  findById(journeyPassengerId: string): Promise<JourneyPassengerEntity | null>;
  findByJourneyId(journeyId: string): Promise<JourneyPassengerEntity[]>;
}
