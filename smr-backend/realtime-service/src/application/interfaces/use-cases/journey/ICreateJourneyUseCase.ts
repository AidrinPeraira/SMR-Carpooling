import { CreateJourneyRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case handles creating a copy of live journeys
 * for live location and validations
 */
export interface ICreateJourneyUseCase {
  execute(dto: CreateJourneyRequestDTO): Promise<void>;
}
