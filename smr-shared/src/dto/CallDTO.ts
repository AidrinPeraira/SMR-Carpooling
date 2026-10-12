export interface InitiateCallDTO {
  trip_id: string;
  caller_id: string;
  receiver_id: string;
}

export interface InitiateCallOutgoingPayload {
  call_session_id: string;
  caller_id: string;
  trip_id: string;
}

export interface InitiateCallConfirmationPayload {
  call_session_id: string;
}

export interface AcceptCallDTO {
  call_session_id: string;
}

export interface AcceptCallCallerPayload {
  call_session_id: string;
  receiver_id: string;
}

export interface AcceptCallReceiverPayload {
  call_session_id: string;
  caller_id: string;
}

export interface RejectCallDTO {
  call_session_id: string;
}

export interface RejectCallPayload {
  call_session_id: string;
}

export interface HandleCallTimeoutDTO {
  call_session_id: string;
}

export interface CallTimeoutPayload {
  call_session_id: string;
}

export interface EndCallDTO {
  call_session_id: string;
}

export interface EndCallPayload {
  call_session_id: string;
}

export interface RelayCallSignalDTO {
  call_session_id: string;
  signal_type: string;
  signal_data: unknown;
}

export interface RelayCallSignalPayload {
  call_session_id: string;
  signal_type: string;
  signal_data: unknown;
}
