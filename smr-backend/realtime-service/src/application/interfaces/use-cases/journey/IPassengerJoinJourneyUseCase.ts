import { PassengerJoinJourneyRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case handles verifying and allowing the
 * user to join the jounrey room. It validates the
 * passengerId against journey records.
 */
export interface IPassengerJoinJourneyUseCase {
  execute(dto: PassengerJoinJourneyRequestDTO, socketId: string): Promise<void>;
}
