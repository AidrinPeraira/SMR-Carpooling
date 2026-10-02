import {
  AcceptCallCallerPayloadDTO,
  AcceptCallReceiverPayloadDTO,
  AcceptCallRequestDTO,
  InitiateCallConfirmationPayloadDTO,
  InitiateCallOutgoingPayloadDTO,
  InitiateCallRequestDTO,
  RejectCallPayloadDTO,
  RejectCallRequestDTO,
  HandleCallTimeoutRequestDTO,
  CallTimeoutPayloadDTO,
  EndCallRequestDTO,
  EndCallPayloadDTO,
  RelayCallSignalRequestDTO,
  RelayCallSignalPayloadDTO,
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
  HandleCallTimeoutDTO,
  CallTimeoutPayload,
  EndCallDTO,
  EndCallPayload,
  RelayCallSignalDTO,
  RelayCallSignalPayload,
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

  static toHandleCallTimeoutRequestDTO(
    payload: HandleCallTimeoutDTO,
    userId: string,
  ): HandleCallTimeoutRequestDTO {
    return {
      callSessionId: payload.call_session_id,
      userId,
    };
  }

  static toCallTimeoutPayload(
    dto: CallTimeoutPayloadDTO,
  ): CallTimeoutPayload {
    return {
      call_session_id: dto.callSessionId,
    };
  }

  static toEndCallRequestDTO(
    payload: EndCallDTO,
    userId: string,
  ): EndCallRequestDTO {
    return {
      callSessionId: payload.call_session_id,
      userId,
    };
  }

  static toEndCallPayload(
    dto: EndCallPayloadDTO,
  ): EndCallPayload {
    return {
      call_session_id: dto.callSessionId,
    };
  }

  static toRelayCallSignalRequestDTO(
    payload: RelayCallSignalDTO,
    userId: string,
  ): RelayCallSignalRequestDTO {
    return {
      callSessionId: payload.call_session_id,
      userId,
      signalType: payload.signal_type,
      signalData: payload.signal_data,
    };
  }

  static toRelayCallSignalPayload(
    dto: RelayCallSignalPayloadDTO,
  ): RelayCallSignalPayload {
    return {
      call_session_id: dto.callSessionId,
      signal_type: dto.signalType,
      signal_data: dto.signalData,
    };
  }
}
