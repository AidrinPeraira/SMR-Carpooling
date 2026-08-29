import { IInitiateCallUseCase } from "#/application/interfaces/use-cases/call/IInitiateCallUseCase";
import { InitiateCallRequestDTO } from "#/application/dto/CallDTO";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import {
  CallStatus,
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  ErrorDetails,
  CallErrorMessage,
} from "@sharemyride/shared";

export class InitiateCallUseCase implements IInitiateCallUseCase {
  constructor(
    private readonly _memberRepository: IMemberRepository,
    private readonly _callSessionRepository: ICallSessionRepository,
    private readonly _socketGateway: ISocketGateway,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
  ) {}

  async execute(dto: InitiateCallRequestDTO): Promise<void> {
    const { tripId, callerId, receiverId } = dto;

    const caller = await this._memberRepository.findByCustomId(callerId);
    if (!caller || !caller.activeTrips.includes(tripId)) {
      throw new ApplicationError(
        CallErrorMessage.NOT_AUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "InitiateCallUseCase",
          description: `Caller ${callerId} is not authorized or not in trip ${tripId}.`,
        },
      );
    }

    const receiver = await this._memberRepository.findByCustomId(receiverId);
    if (!receiver || !receiver.activeTrips.includes(tripId)) {
      throw new ApplicationError(
        CallErrorMessage.NOT_AUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        ErrorDetails.DOMAIN_ACCESS_DENIED,
        {
          location: "InitiateCallUseCase",
          description: `Receiver ${receiverId} is not authorized or not in trip ${tripId}.`,
        },
      );
    }

    // Check if receiver is online
    const isReceiverOnline =
      await this._socketGateway.isUserConnected(receiverId);
    if (!isReceiverOnline) {
      await this._socketGateway.emitToUser(callerId, "call-error", {
        message: "Receiver is currently offline.",
      });
      return;
    }

    // Check if receiver is already in an active or ringing call
    const receiverCalls = await this._callSessionRepository.find({
      filterField: "receiverId",
      filterValue: receiverId,
      page: 1,
      limit: 10,
    });

    const isBusy = receiverCalls.data?.some(
      (c) =>
        c.callStatus === CallStatus.ACTIVE_CALL ||
        c.callStatus === CallStatus.RINGING,
    );

    if (isBusy) {
      await this._socketGateway.emitToUser(callerId, "call-busy", {
        message: "Receiver is currently busy on another call.",
      });
      return;
    }

    const callSessionId = this._uniqueIdGenerator.generateRandomId();
    const now = new Date();

    await this._callSessionRepository.save({
      callSessionId,
      callerId,
      receiverId,
      callStatus: CallStatus.RINGING,
      joinedAt: now,
      leftAt: now,
    });

    await this._socketGateway.emitToUser(receiverId, "call-incoming", {
      callSessionId,
      callerId,
      tripId,
    });

    await this._socketGateway.emitToUser(callerId, "call-initiated", {
      callSessionId,
    });
  }
}
