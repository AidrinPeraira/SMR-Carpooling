export interface InitiateCallRequestDTO {
  tripId: string;
  callerId: string;
  receiverId: string;
}

export interface AcceptCallRequestDTO {
  callSessionId: string;
}

export interface RejectCallRequestDTO {
  callSessionId: string;
}

export interface RelayCallSignalRequestDTO {
  callSessionId: string;
  senderUserId: string;
  signalType: "sdp_offer" | "sdp_answer" | "ice_candidate";
  signalData: unknown;
}

export interface IncomingCallPayload {
  callSessionId: string;
  callerId: string;
  tripId: string;
}
