import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { JourneyEntity } from "#/domain/entities/JourneyEntity";

/**
 * This repository handles persistance for the
 * journey details
 */
export interface IJourneyRepository extends IBaseRepository<JourneyEntity> {}
