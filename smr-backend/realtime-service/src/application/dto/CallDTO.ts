export interface InitiateCallRequestDTO {
  tripId: string;
  callerId: string;
  receiverId: string;
}

export interface InitiateCallOutgoingPayloadDTO {
  callSessionId: string;
  callerId: string;
  tripId: string;
}

export interface InitiateCallConfirmationPayloadDTO {
  callSessionId: string;
}

export interface AcceptCallRequestDTO {
  callSessionId: string;
  userId: string;
}

export interface AcceptCallCallerPayloadDTO {
  callSessionId: string;
  receiverId: string;
}

export interface AcceptCallReceiverPayloadDTO {
  callSessionId: string;
  callerId: string;
}

export interface RejectCallRequestDTO {
  callSessionId: string;
  userId: string;
}

export interface RejectCallPayloadDTO {
  callSessionId: string;
}

export interface HandleCallTimeoutRequestDTO {
  callSessionId: string;
  userId: string;
}

export interface CallTimeoutPayloadDTO {
  callSessionId: string;
}

export interface EndCallRequestDTO {
  callSessionId: string;
  userId: string;
}

export interface EndCallPayloadDTO {
  callSessionId: string;
}
