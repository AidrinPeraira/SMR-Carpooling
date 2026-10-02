import {
  RejectCallPayloadDTO,
  RejectCallRequestDTO,
} from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IRejectCallUseCase } from "#/application/interfaces/use-cases/call/IRejectCallUseCase";
import { CallSocketMapper } from "#/application/mapper/CallSocketMapper";
import {
  ApplicationError,
  CallErrorMessage,
  CallStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  SocketEvents,
} from "@sharemyride/shared";

export class RejectCallUseCase implements IRejectCallUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: RejectCallRequestDTO): Promise<void> {
    const { callSessionId, userId } = dto;

    const callSession =
      await this._callSessionRepository.findByCustomId(callSessionId);

    if (!callSession) {
      throw new ApplicationError(
        CallErrorMessage.CALL_SESSION_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "RejectCallUseCase",
          details: `Call session not found: ${callSessionId}`,
        },
      );
    }

    if (callSession.receiverId !== userId) {
      throw new ApplicationError(
        CallErrorMessage.NOT_AUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "RejectCallUseCase",
          details: `User ${userId} is not the receiver of call session ${callSessionId}`,
        },
      );
    }

    if (callSession.callStatus !== CallStatus.RINGING) {
      throw new ApplicationError(
        CallErrorMessage.NOT_RINGING,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "RejectCallUseCase",
          details: `Call session ${callSessionId} is in status ${callSession.callStatus}, expected ${CallStatus.RINGING}`,
        },
      );
    }

    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.MISSED_CALL,
      leftAt: new Date(),
    });

    const rejectPayload: RejectCallPayloadDTO = { callSessionId };
    await this._socketEmitter.emitToRoom(
      `user:${callSession.callerId}`,
      SocketEvents.CALL_REJECTED,
      CallSocketMapper.toRejectCallPayload(rejectPayload),
    );
  }
}
