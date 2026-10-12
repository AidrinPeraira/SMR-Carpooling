import { ShareTokenJoinJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";
import { ISocketStore } from "#/application/interfaces/services/ISocketStore";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IShareTokenJoinJourneyUseCase } from "#/application/interfaces/use-cases/journey/IShareTokenJoinJourneyUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
} from "@sharemyride/shared";

/**
 * This use case handles socket connection to journey room
 * using share tokens. It validates the share token and its passenger
 * id and verifies to allow the connection to join journey room.
 */
export class ShareTokenJoinJourneyUseCase implements IShareTokenJoinJourneyUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _socketStore: ISocketStore,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(
    dto: ShareTokenJoinJourneyRequestDTO,
    socketId: string,
  ): Promise<void> {
    const memberId = await this._journeyRepository.findMemberShareToken(
      dto.journeyId,
      dto.shareToken,
    );

    if (!memberId) {
      throw new ApplicationError(
        JourneyErrorMessage.INVALID_SHARE_TOKEN,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "ShareTokenJoinJourneyUseCase",
          details: `Invalid share token for journey ${dto.journeyId}`,
        },
      );
    }

    await this._socketStore.addSocket(dto.journeyId, dto.shareToken, socketId);

    await this._socketEmitter.joinRoom(`journey:${dto.journeyId}`, socketId);
  }
}
