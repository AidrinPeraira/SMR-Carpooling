import {
  AcceptCallCallerPayloadDTO,
  AcceptCallReceiverPayloadDTO,
  AcceptCallRequestDTO,
} from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IAcceptCallUseCase } from "#/application/interfaces/use-cases/call/IAcceptCallUseCase";
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

export class AcceptCallUseCase implements IAcceptCallUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: AcceptCallRequestDTO): Promise<void> {
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
          location: "AcceptCallUseCase",
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
          location: "AcceptCallUseCase",
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
          location: "AcceptCallUseCase",
          details: `Call session ${callSessionId} is in status ${callSession.callStatus}, expected ${CallStatus.RINGING}`,
        },
      );
    }

    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.ACTIVE_CALL,
      joinedAt: new Date(),
    });

    const callerPayload: AcceptCallCallerPayloadDTO = {
      callSessionId,
      receiverId: userId,
    };
    await this._socketEmitter.emitToRoom(
      `user:${callSession.callerId}`,
      SocketEvents.CALL_ACCEPTED,
      CallSocketMapper.toAcceptCallCallerPayload(callerPayload),
    );

    const receiverPayload: AcceptCallReceiverPayloadDTO = {
      callSessionId,
      callerId: callSession.callerId,
    };
    await this._socketEmitter.emitToRoom(
      `user:${userId}`,
      SocketEvents.CALL_ACCEPTED,
      CallSocketMapper.toAcceptCallReceiverPayload(receiverPayload),
    );
  }
}
