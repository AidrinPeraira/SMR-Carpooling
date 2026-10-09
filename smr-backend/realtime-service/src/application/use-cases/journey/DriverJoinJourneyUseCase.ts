import { DriverJoinJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IDriverJoinJourneyUseCase } from "#/application/interfaces/use-cases/journey/IDriverJoinJourneyUseCase";

/**
 * This class implements the use case that allows the
 * driver to join a room for a active trip journey.
 * The driver is free to join directly
 */
export class DriverJoinJourneyUseCase implements IDriverJoinJourneyUseCase {
  constructor(private readonly _socketEmitter: ISocketEmitter) {}

  async execute(
    dto: DriverJoinJourneyRequestDTO,
    socketId: string,
  ): Promise<void> {
    await this._socketEmitter.joinRoom(`journey:${dto.journeyId}`, socketId);
  }
}
