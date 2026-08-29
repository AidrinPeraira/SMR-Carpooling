import { IRejectCallUseCase } from "#/application/interfaces/use-cases/call/IRejectCallUseCase";
import { RejectCallRequestDTO } from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import {
  CallStatus,
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  ErrorDetails,
  CallErrorMessage,
} from "@sharemyride/shared";

export class RejectCallUseCase implements IRejectCallUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketGateway: ISocketGateway,
  ) {}

  async execute(dto: RejectCallRequestDTO): Promise<void> {
    const { callSessionId } = dto;

    const session =
      await this._callSessionRepository.findByCustomId(callSessionId);
    if (!session) {
      throw new ApplicationError(
        CallErrorMessage.CALL_SESSION_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "RejectCallUseCase",
          description: `Call session not found for id: ${callSessionId}`,
        },
      );
    }

    if (session.callStatus !== CallStatus.RINGING) {
      throw new ApplicationError(
        CallErrorMessage.NOT_RINGING,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "RejectCallUseCase",
          description: `Cannot reject a call that is not ringing: ${callSessionId}`,
        },
      );
    }

    const now = new Date();
    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.ENDED, // Or MISSED_CALL if needed, using ENDED
      leftAt: now,
    });

    await this._socketGateway.emitToUser(session.callerId, "call-rejected", {
      callSessionId,
      message: "The receiver rejected the call.",
    });
  }
}
