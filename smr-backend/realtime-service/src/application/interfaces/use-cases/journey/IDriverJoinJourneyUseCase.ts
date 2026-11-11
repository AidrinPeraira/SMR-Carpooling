import { DriverJoinJourneyRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case creates / joins a room for an active journey
 * for the driver
 */
export interface IDriverJoinJourneyUseCase {
  execute(dto: DriverJoinJourneyRequestDTO, socketId: string): Promise<void>;
}
