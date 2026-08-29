import { IHandleCallTimeoutUseCase } from "#/application/interfaces/use-cases/call/IHandleCallTimeoutUseCase";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { CallStatus, ApplicationError, ErrorCode, HttpStatusCodes, ErrorDetails, CallErrorMessage } from "@sharemyride/shared";

export class HandleCallTimeoutUseCase implements IHandleCallTimeoutUseCase {
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
          location: "HandleCallTimeoutUseCase",
          description: `Call session not found for id: ${callSessionId}`,
        }
      );
    }

    if (session.callStatus !== CallStatus.RINGING) {
      return; // Only time out if still ringing
    }

    const now = new Date();
    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.MISSED_CALL,
      leftAt: now,
    });

    await this._socketGateway.emitToUser(session.callerId, "call-timeout", {
      callSessionId,
      message: "The call went unanswered.",
    });

    await this._socketGateway.emitToUser(session.receiverId, "call-missed", {
      callSessionId,
      callerId: session.callerId,
      message: "You missed a call.",
    });
  }
}
