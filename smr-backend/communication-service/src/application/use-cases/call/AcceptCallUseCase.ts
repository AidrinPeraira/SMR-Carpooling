import { IAcceptCallUseCase } from "#/application/interfaces/use-cases/call/IAcceptCallUseCase";
import { AcceptCallRequestDTO } from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { CallStatus, ApplicationError, ErrorCode, HttpStatusCodes, ErrorDetails, CallErrorMessage } from "@sharemyride/shared";

export class AcceptCallUseCase implements IAcceptCallUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketGateway: ISocketGateway
  ) {}

  async execute(dto: AcceptCallRequestDTO): Promise<void> {
    const { callSessionId } = dto;

    const session = await this._callSessionRepository.findByCustomId(callSessionId);
    if (!session) {
      throw new ApplicationError(
        CallErrorMessage.CALL_SESSION_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "AcceptCallUseCase",
          description: `Call session not found for id: ${callSessionId}`,
        }
      );
    }

    if (session.callStatus !== CallStatus.RINGING) {
      throw new ApplicationError(
        CallErrorMessage.NOT_RINGING,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "AcceptCallUseCase",
          description: `Call session is not ringing: ${callSessionId}`,
        }
      );
    }

    const now = new Date();
    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.ACTIVE_CALL,
      joinedAt: now,
    });

    await this._socketGateway.emitToUser(session.callerId, "call-accepted", {
      callSessionId,
      receiverId: session.receiverId,
    });

    await this._socketGateway.emitToUser(session.receiverId, "call-accepted", {
      callSessionId,
      callerId: session.callerId,
    });
  }
}
