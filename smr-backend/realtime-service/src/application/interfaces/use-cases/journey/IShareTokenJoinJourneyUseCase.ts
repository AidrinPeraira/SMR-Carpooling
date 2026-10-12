import { ShareTokenJoinJourneyRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case allows third parties to join the journey
 * room by verifying the share token agains the passenger
 * details.
 */
export interface IShareTokenJoinJourneyUseCase {
  execute(
    dto: ShareTokenJoinJourneyRequestDTO,
    socketId: string,
  ): Promise<void>;
}
