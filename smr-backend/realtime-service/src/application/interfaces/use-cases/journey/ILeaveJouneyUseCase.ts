import { LeaveJourneyRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case handles any user leaving the room
 * for journey. It also clears any sockets joined via share tokens.
 */
export interface ILeaveJourneyUseCase {
  execute(dto: LeaveJourneyRequestDTO, socketId: string): Promise<void>;
}
