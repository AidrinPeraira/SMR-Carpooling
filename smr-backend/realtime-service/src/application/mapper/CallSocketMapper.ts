import {
  AcceptCallCallerPayloadDTO,
  AcceptCallReceiverPayloadDTO,
  AcceptCallRequestDTO,
  InitiateCallConfirmationPayloadDTO,
  InitiateCallOutgoingPayloadDTO,
  InitiateCallRequestDTO,
  RejectCallPayloadDTO,
  RejectCallRequestDTO,
} from "#/application/dto/CallDTO";
import {
  AcceptCallCallerPayload,
  AcceptCallDTO,
  AcceptCallReceiverPayload,
  InitiateCallConfirmationPayload,
  InitiateCallDTO,
  InitiateCallOutgoingPayload,
  RejectCallDTO,
  RejectCallPayload,
} from "@sharemyride/shared";

export class CallSocketMapper {
  static toInitiateCallRequestDTO(
    payload: InitiateCallDTO,
    callerId: string,
  ): InitiateCallRequestDTO {
    return {
      tripId: payload.trip_id,
      callerId,
      receiverId: payload.receiver_id,
    };
  }

  static toInitiateCallOutgoingPayload(
    dto: InitiateCallOutgoingPayloadDTO,
  ): InitiateCallOutgoingPayload {
    return {
      call_session_id: dto.callSessionId,
      caller_id: dto.callerId,
      trip_id: dto.tripId,
    };
  }

  static toInitiateCallConfirmationPayload(
    dto: InitiateCallConfirmationPayloadDTO,
  ): InitiateCallConfirmationPayload {
    return {
      call_session_id: dto.callSessionId,
    };
  }

  static toAcceptCallRequestDTO(
    payload: AcceptCallDTO,
    userId: string,
  ): AcceptCallRequestDTO {
    return {
      callSessionId: payload.call_session_id,
      userId,
    };
  }

  static toAcceptCallCallerPayload(
    dto: AcceptCallCallerPayloadDTO,
  ): AcceptCallCallerPayload {
    return {
      call_session_id: dto.callSessionId,
      receiver_id: dto.receiverId,
    };
  }

  static toAcceptCallReceiverPayload(
    dto: AcceptCallReceiverPayloadDTO,
  ): AcceptCallReceiverPayload {
    return {
      call_session_id: dto.callSessionId,
      caller_id: dto.callerId,
    };
  }

  static toRejectCallRequestDTO(
    payload: RejectCallDTO,
    userId: string,
  ): RejectCallRequestDTO {
    return {
      callSessionId: payload.call_session_id,
      userId,
    };
  }

  static toRejectCallPayload(
    dto: RejectCallPayloadDTO,
  ): RejectCallPayload {
    return {
      call_session_id: dto.callSessionId,
    };
  }
}
