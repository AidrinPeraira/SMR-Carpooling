import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { JourneyEntity } from "#/domain/entities/JourneyEntity";

/**
 * This repository handles db operations for jounrney data
 */
export interface IJourneyRepository extends IBaseRepository<JourneyEntity> {
  findByJourneyId(journeyId: string): Promise<JourneyEntity | null>;

  findMemberShareToken(
    journeyId: string,
    shareToken: string,
  ): Promise<string | null>;

  setMemberShareToken(
    journeyId: string,
    memberId: string,
    shareToken: string,
  ): Promise<void>;
}
