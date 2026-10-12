import { EndJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";
import { ISocketStore } from "#/application/interfaces/services/ISocketStore";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IEndJourneyUseCase } from "#/application/interfaces/use-cases/journey/IEndJourneyUseCase";
import { SocketEvents } from "@sharemyride/shared";

/**
 * This class implements the use case that handles clean up
 * after a journey is completed. It clears any socket rooms
 * and clears the store of stored socket id related to journey
 * and also deletes the journey record
 */
export class EndJourneyUseCase implements IEndJourneyUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _socketStore: ISocketStore,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: EndJourneyRequestDTO): Promise<void> {
    await this._socketEmitter.emitToRoom(
      `journey:${dto.journeyId}`,
      SocketEvents.JOURNEY_ENDED,
      { journeyId: dto.journeyId },
    );

    const sockets = await this._socketStore.getSocketsByJourney(dto.journeyId);

    for (const [, socketId] of sockets) {
      await this._socketEmitter.leaveRoom(`journey:${dto.journeyId}`, socketId);
    }

    await this._socketStore.clearJourney(dto.journeyId);
    await this._journeyRepository.deleteByCustomId(dto.journeyId);
  }
}
