export enum CallErrorMessage {
  NOT_AUTHORIZED = "Caller or receiver is not authorized or not in the specified trip.",
  CALL_SESSION_NOT_FOUND = "Call session not found.",
  NOT_RINGING = "Call is not in a ringing state.",
  CALLER_NOT_FOUND = "Caller not found.",
  RECEIVER_NOT_FOUND = "Receiver not found.",
  CALLER_NOT_IN_TRIP = "Caller is not a member of the specified trip.",
  RECEIVER_NOT_IN_TRIP = "Receiver is not a member of the specified trip.",
  RECEIVER_OFFLINE = "Receiver is currently offline.",
  RECEIVER_BUSY = "Receiver is currently on another call.",
}
