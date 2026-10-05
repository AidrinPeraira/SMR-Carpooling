"use client";

import { createContext, useContext } from "react";

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

export interface VoiceCallContextValue {
  callState: CallState;
  incomingCall: IncomingCall | null;
  remoteStream: MediaStream | null;
  notification: CallNotification | null;
  initiateCall: (tripId: string, receiverId: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  dismissNotification: () => void;
}

export const VoiceCallContext = createContext<VoiceCallContextValue | null>(
  null,
);

export function useVoiceCall() {
  const ctx = useContext(VoiceCallContext);
  if (!ctx) {
    throw new Error("useVoiceCall must be used within a VoiceCallProvider");
  }
  return ctx;
}
