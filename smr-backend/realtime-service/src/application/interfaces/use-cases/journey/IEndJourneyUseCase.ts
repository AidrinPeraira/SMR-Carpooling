import { EndJourneyRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case handles cleanup of socket connections
 * and rooms on jounrey completion. It also clears the journey records
 */
export interface IEndJourneyUseCase {
  execute(dto: EndJourneyRequestDTO): Promise<void>;
}
