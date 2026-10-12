export type CallState = "IDLE" | "CALLING" | "RINGING" | "IN_CALL";

export interface IncomingCall {
  callSessionId: string;
  callerId: string;
  tripId: string;
}

export interface CallNotification {
  type: "rejected" | "busy" | "error";
  message: string;
}

