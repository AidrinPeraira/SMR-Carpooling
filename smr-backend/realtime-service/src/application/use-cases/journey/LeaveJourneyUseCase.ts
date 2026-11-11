import { LeaveJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { ISocketStore } from "#/application/interfaces/services/ISocketStore";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { ILeaveJourneyUseCase } from "#/application/interfaces/use-cases/journey/ILeaveJouneyUseCase";

/**
 * This class implements the use case that handles a user leaving
 * a socket room. It clears the socket store record related to that
 * user and leaves room.
 */
export class LeaveJourneyUseCase implements ILeaveJourneyUseCase {
  constructor(
    private readonly _socketStore: ISocketStore,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: LeaveJourneyRequestDTO, socketId: string): Promise<void> {
    const sockets = await this._socketStore.getSocketsByJourney(dto.journeyId);

    for (const [token, storedSocketId] of sockets) {
      if (storedSocketId === socketId) {
        await this._socketStore.removeSocket(dto.journeyId, token);
        break;
      }
    }

    await this._socketEmitter.leaveRoom(`journey:${dto.journeyId}`, socketId);
  }
}
