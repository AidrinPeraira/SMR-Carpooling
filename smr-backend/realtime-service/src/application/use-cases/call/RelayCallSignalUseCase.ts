import {
  RelayCallSignalPayloadDTO,
  RelayCallSignalRequestDTO,
} from "#/application/dto/CallDTO";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IRelayCallSignalUseCase } from "#/application/interfaces/use-cases/call/IRelayCallSignalUseCase";
import { CallSocketMapper } from "#/application/mapper/CallSocketMapper";
import {
  ApplicationError,
  CallErrorMessage,
  CallSignalType,
  CallStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  SocketEvents,
} from "@sharemyride/shared";

const VALID_SIGNAL_TYPES = Object.values(CallSignalType) as string[];

/**
 * This class implements the use case that
 * exchages ICE singal between caller and receiver
 */
export class RelayCallSignalUseCase implements IRelayCallSignalUseCase {
  constructor(
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: RelayCallSignalRequestDTO): Promise<void> {
    const { callSessionId, userId, signalType, signalData } = dto;

    if (!VALID_SIGNAL_TYPES.includes(signalType)) {
      throw new ApplicationError(
        CallErrorMessage.INVALID_SIGNAL_TYPE,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "RelayCallSignalUseCase",
          details: `Invalid signal type: ${signalType}`,
        },
      );
    }

    const callSession =
      await this._callSessionRepository.findByCustomId(callSessionId);

    if (!callSession) {
      throw new ApplicationError(
        CallErrorMessage.CALL_SESSION_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "RelayCallSignalUseCase",
          details: `Call session not found: ${callSessionId}`,
        },
      );
    }

    if (callSession.callerId !== userId && callSession.receiverId !== userId) {
      throw new ApplicationError(
        CallErrorMessage.NOT_AUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "RelayCallSignalUseCase",
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
          location: "RelayCallSignalUseCase",
          details: `Call session ${callSessionId} is in status ${callSession.callStatus}, expected ${CallStatus.ACTIVE_CALL}`,
        },
      );
    }

    const otherPartyId =
      callSession.callerId === userId
        ? callSession.receiverId
        : callSession.callerId;

    const signalPayload: RelayCallSignalPayloadDTO = {
      callSessionId,
      signalType,
      signalData,
    };

    await this._socketEmitter.emitToRoom(
      `user:${otherPartyId}`,
      SocketEvents.CALL_SIGNAL,
      CallSocketMapper.toRelayCallSignalPayload(signalPayload),
    );
  }
}
