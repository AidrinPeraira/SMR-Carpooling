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
