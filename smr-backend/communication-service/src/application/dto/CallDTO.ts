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
  signalData: any;
}
