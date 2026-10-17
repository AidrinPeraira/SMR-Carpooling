import { PassengerJoinJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";
import { ISocketStore } from "#/application/interfaces/services/ISocketStore";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IPassengerJoinJourneyUseCase } from "#/application/interfaces/use-cases/journey/IPassengerJoinJourneyUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
} from "@sharemyride/shared";

export class PassengerJoinJourneyUseCase implements IPassengerJoinJourneyUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _socketEmitter: ISocketEmitter,
    private readonly _socketStore: ISocketStore,
  ) {}

  async execute(
    dto: PassengerJoinJourneyRequestDTO,
    socketId: string,
  ): Promise<void> {
    const journey = await this._journeyRepository.findByJourneyId(
      dto.journeyId,
    );

    if (!journey) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "PassengerJoinJourneyUseCase",
          details: `Journey not found: ${dto.journeyId}`,
        },
      );
    }

    if (!journey.isActive) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_ACTIVE,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "PassengerJoinJourneyUseCase",
          details: `Journey is not active: ${dto.journeyId}`,
        },
      );
    }

    const isMember = journey.members.some(
      (member) => member.memberId === dto.userId,
    );

    if (!isMember) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "PassengerJoinJourneyUseCase",
          details: `User ${dto.userId} is not a member of journey ${dto.journeyId}`,
        },
      );
    }

    await this._socketStore.addSocket(dto.journeyId, dto.userId, socketId);
    await this._socketEmitter.joinRoom(`journey:${dto.journeyId}`, socketId);
  }
}
