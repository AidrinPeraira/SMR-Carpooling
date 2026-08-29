import { IRelayCallSignalUseCase } from "#/application/interfaces/use-cases/call/IRelayCallSignalUseCase";
import { RelayCallSignalRequestDTO } from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { ApplicationError, ErrorCode, HttpStatusCodes, ErrorDetails, CallErrorMessage } from "@sharemyride/shared";

export class RelayCallSignalUseCase implements IRelayCallSignalUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketGateway: ISocketGateway
  ) {}

  async execute(dto: RelayCallSignalRequestDTO): Promise<void> {
    const { callSessionId, senderUserId, signalType, signalData } = dto;

    const session = await this._callSessionRepository.findByCustomId(callSessionId);
    if (!session) {
      throw new ApplicationError(
        CallErrorMessage.CALL_SESSION_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "RelayCallSignalUseCase",
          description: `Call session not found for id: ${callSessionId}`,
        }
      );
    }

    if (session.callerId !== senderUserId && session.receiverId !== senderUserId) {
      throw new ApplicationError(
        CallErrorMessage.NOT_AUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "RelayCallSignalUseCase",
          description: `User ${senderUserId} is not part of call session ${callSessionId}`,
        }
      );
    }

    const targetUserId = session.callerId === senderUserId ? session.receiverId : session.callerId;

    await this._socketGateway.emitToUser(targetUserId, "call-signal", {
      callSessionId,
      senderUserId,
      signalType,
      signalData,
    });
  }
}
