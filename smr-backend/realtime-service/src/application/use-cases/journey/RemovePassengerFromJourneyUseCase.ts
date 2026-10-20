import { RemovePassengerFromJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";
import { ISocketStore } from "#/application/interfaces/services/ISocketStore";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IRemovePassengerFromJourneyUseCase } from "#/application/interfaces/use-cases/journey/IRemovePassengerFromJourneyUseCase";

/**
 * Removes a passenger from a journey room server-side.
 * Pulls the member from the journey record, and if they
 * had a share token, removes the associated socket from
 * Redis and the room.
 */
export class RemovePassengerFromJourneyUseCase
  implements IRemovePassengerFromJourneyUseCase
{
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _socketStore: ISocketStore,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: RemovePassengerFromJourneyRequestDTO): Promise<void> {
    const shareToken = await this._journeyRepository.removeMember(
      dto.journeyId,
      dto.passengerId,
    );

    const tokenKey = shareToken ?? dto.passengerId;
    const socketId = await this._socketStore.getSocketByToken(
      dto.journeyId,
      tokenKey,
    );

    if (socketId) {
      await this._socketEmitter.leaveRoom(
        `journey:${dto.journeyId}`,
        socketId,
      );
    }

    await this._socketStore.removeSocket(dto.journeyId, tokenKey);
  }
}
