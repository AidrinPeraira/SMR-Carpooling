import { EndCallPayloadDTO, EndCallRequestDTO } from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IEndCallUseCase } from "#/application/interfaces/use-cases/call/IEndCallUseCase";
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

export class EndCallUseCase implements IEndCallUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: EndCallRequestDTO): Promise<void> {
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
          location: "EndCallUseCase",
          details: `Call session not found: ${callSessionId}`,
        },
      );
    }

    if (
      callSession.callerId !== userId &&
      callSession.receiverId !== userId
    ) {
      throw new ApplicationError(
        CallErrorMessage.NOT_AUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "EndCallUseCase",
          details: `User ${userId} is not part of call session ${callSessionId}`,
        },
      );
    }

    if (callSession.callStatus !== CallStatus.ACTIVE_CALL) {
      throw new ApplicationError(
        CallErrorMessage.CALL_NOT_ACTIVE,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "EndCallUseCase",
          details: `Call session ${callSessionId} is in status ${callSession.callStatus}, expected ${CallStatus.ACTIVE_CALL}`,
        },
      );
    }

    await this._callSessionRepository.updateByCustomId(callSessionId, {
      callStatus: CallStatus.ENDED,
      leftAt: new Date(),
    });

    const endPayload: EndCallPayloadDTO = { callSessionId };
    const otherPartyId =
      callSession.callerId === userId
        ? callSession.receiverId
        : callSession.callerId;

    await this._socketEmitter.emitToRoom(
      `user:${otherPartyId}`,
      SocketEvents.CALL_ENDED,
      CallSocketMapper.toEndCallPayload(endPayload),
    );
  }
}
