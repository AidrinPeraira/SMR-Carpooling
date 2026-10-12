import {
  GetShareTokenRequestDTO,
  GetShareTokenResponseDTO,
} from "#/application/dto/JourneyDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIDGenerator";
import { IGetShareTokenUseCase } from "#/application/interfaces/use-cases/journey/IGetShareTokenUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
} from "@sharemyride/shared";

/**
 * This class implements the use case that
 * handles issuing a share token for sharing live location details
 */
export class GetShareTokenUseCase implements IGetShareTokenUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _idGenerator: IUniqueIdGenerator,
  ) {}

  async execute(
    dto: GetShareTokenRequestDTO,
  ): Promise<GetShareTokenResponseDTO> {
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
          location: "GetShareTokenUseCase",
          details: `Journey not found: ${dto.journeyId}`,
        },
      );
    }

    const member = journey.members.find((m) => m.memberId === dto.userId);

    if (!member) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "GetShareTokenUseCase",
          details: `User ${dto.userId} is not a member of journey ${dto.journeyId}`,
        },
      );
    }

    if (member.shareToken) {
      return { shareToken: member.shareToken };
    }

    const shareToken = this._idGenerator.generateRandomId();

    await this._journeyRepository.setMemberShareToken(
      dto.journeyId,
      dto.userId,
      shareToken,
    );

    return { shareToken };
  }
}
