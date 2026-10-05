"use client";

import { createContext, useContext } from "react";
import {
  CallState,
  IncomingCall,
  CallNotification,
} from "@/features/realtime/types/VoiceCallTypes";

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
