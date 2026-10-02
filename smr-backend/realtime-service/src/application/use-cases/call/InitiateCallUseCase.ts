import {
  InitiateCallConfirmationPayloadDTO,
  InitiateCallOutgoingPayloadDTO,
  InitiateCallRequestDTO,
} from "#/application/dto/CallDTO";
import { CallSocketMapper } from "#/application/mapper/CallSocketMapper";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIDGenerator";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IInitiateCallUseCase } from "#/application/interfaces/use-cases/call/IInitiateCallUseCase";
import {
  ApplicationError,
  CallErrorMessage,
  CallStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  SocketEvents,
} from "@sharemyride/shared";

/**
 * This class implements the use case to initiate a call between
 * two members after validating the required credentials
 */
export class InitiateCallUseCase implements IInitiateCallUseCase {
  constructor(
    private readonly _memberRepository: IMemberRepository,
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
    private readonly _socketEmitter: ISocketEmitter,
  ) {}

  async execute(dto: InitiateCallRequestDTO): Promise<void> {
    const { tripId, callerId, receiverId } = dto;

    //check if the call request is valid

    const caller = await this._memberRepository.findByCustomId(callerId);
    if (!caller) {
      throw new ApplicationError(
        CallErrorMessage.CALLER_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "InitiateCallUseCase",
          details: `Caller not found for userId: ${callerId}`,
        },
      );
    }
    if (!caller.activeTrips.includes(tripId)) {
      throw new ApplicationError(
        CallErrorMessage.CALLER_NOT_IN_TRIP,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "InitiateCallUseCase",
          details: `Caller ${callerId} is not in trip ${tripId}`,
        },
      );
    }
    const receiver = await this._memberRepository.findByCustomId(receiverId);
    if (!receiver) {
      throw new ApplicationError(
        CallErrorMessage.RECEIVER_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "InitiateCallUseCase",
          details: `Receiver not found for userId: ${receiverId}`,
        },
      );
    }
    if (!receiver.activeTrips.includes(tripId)) {
      throw new ApplicationError(
        CallErrorMessage.RECEIVER_NOT_IN_TRIP,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "InitiateCallUseCase",
          details: `Receiver ${receiverId} is not in trip ${tripId}`,
        },
      );
    }

    //check if receiver is online
    const isReceiverOnline =
      await this._socketEmitter.isUserConnected(receiverId);
    if (!isReceiverOnline) {
      throw new ApplicationError(
        CallErrorMessage.RECEIVER_OFFLINE,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "InitiateCallUseCase",
          details: `Receiver ${receiverId} is not connected`,
        },
      );
    }

    //check is receiver is busy
    const receiverActiveCall =
      await this._callSessionRepository.getUserActiveCall(receiverId);
    if (receiverActiveCall) {
      throw new ApplicationError(
        CallErrorMessage.RECEIVER_BUSY,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "InitiateCallUseCase",
          details: `Receiver ${receiverId} is already in call session ${receiverActiveCall}`,
        },
      );
    }

    //create a new call session
    const newSessionId = this._uniqueIdGenerator.generateRandomId();
    const now = new Date();

    const newSession = await this._callSessionRepository.save({
      callSessionId: newSessionId,
      callerId: callerId,
      receiverId: receiverId,
      callStatus: CallStatus.RINGING,
      joinedAt: now,
      leftAt: now,
    });

    //emit the notification event to receiver
    const receiverRoom = `user:${receiverId}`;
    const callIncomingPayload: InitiateCallOutgoingPayloadDTO = {
      callSessionId: newSession.callSessionId,
      callerId,
      tripId,
    };
    await this._socketEmitter.emitToRoom(
      receiverRoom,
      SocketEvents.CALL_INCOMING,
      CallSocketMapper.toInitiateCallOutgoingPayload(callIncomingPayload),
    );

    //emit the confirmation to sender
    const callerRoom = `user:${callerId}`;
    const callConfirmationPayload: InitiateCallConfirmationPayloadDTO = {
      callSessionId: newSession.callSessionId,
    };
    await this._socketEmitter.emitToRoom(
      callerRoom,
      SocketEvents.CALL_INITIATED,
      CallSocketMapper.toInitiateCallConfirmationPayload(
        callConfirmationPayload,
      ),
    );
  }
}
