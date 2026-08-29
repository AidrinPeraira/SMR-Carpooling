import { IEndCallUseCase } from "#/application/interfaces/use-cases/call/IEndCallUseCase";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { CallStatus, ApplicationError, ErrorCode, HttpStatusCodes, ErrorDetails, CallErrorMessage } from "@sharemyride/shared";

export class EndCallUseCase implements IEndCallUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketGateway: ISocketGateway
  ) {}

  async execute(callSessionId: string): Promise<void> {
    const session = await this._callSessionRepository.findByCustomId(callSessionId);
    if (!session) {
      throw new ApplicationError(
        CallErrorMessage.CALL_SESSION_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "EndCallUseCase",
          description: `Call session not found for id: ${callSessionId}`,
        }
      );
    }

    if (session.callStatus === CallStatus.ENDED || session.callStatus === CallStatus.MISSED_CALL) {
      return; // Already ended
    }

    const now = new Date();
    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.ENDED,
      leftAt: now,
    });

    await this._socketGateway.emitToUser(session.callerId, "call-ended", {
      callSessionId,
    });

    await this._socketGateway.emitToUser(session.receiverId, "call-ended", {
      callSessionId,
    });
  }
}
