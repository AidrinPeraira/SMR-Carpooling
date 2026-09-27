import { JourneyEntity } from "#/domain/entities/JourneyEntity";

/**
 * This repository handles mutations for journey entity
 * It handles CRUD and complex queries as needed
 */
export interface IJourneyRepository {
  save(journey: JourneyEntity): Promise<JourneyEntity>;
  updateById(
    journeyId: string,
    journey: Partial<JourneyEntity>,
  ): Promise<JourneyEntity>;
  findById(journeyId: string): Promise<JourneyEntity | null>;
  findOngoingByDriverId(driverId: string): Promise<JourneyEntity | null>;
}
