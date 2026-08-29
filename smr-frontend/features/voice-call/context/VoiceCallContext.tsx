"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CallSocketService } from "../services/CallSocketService";
import { WebRTCService } from "../services/WebRTCService";
import { IncomingCallPayload, RelayCallSignalRequestDTO } from "../types/CallTypes";
import { useQuery } from "@tanstack/react-query";
import { getUserRequest } from "@/features/profile/api/requests/getUserRequest";

export type CallState = "IDLE" | "CALLING" | "RINGING" | "IN_CALL";

interface CallNotification {
  type: "rejected" | "busy" | "error";
  message: string;
}

interface VoiceCallContextType {
  callState: CallState;
  incomingCall: IncomingCallPayload | null;
  remoteStream: MediaStream | null;
  notification: CallNotification | null;
  dismissNotification: () => void;
  initiateCall: (tripId: string, receiverId: string) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined);

export function VoiceCallProvider({ children }: { children: React.ReactNode }) {
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [notification, setNotification] = useState<CallNotification | null>(null);

  // We track which side we are — the caller creates the SDP offer after call-accepted
  const roleRef = useRef<"caller" | "receiver" | null>(null);
  const currentCallSessionId = useRef<string | null>(null);
  const socketService = useRef<CallSocketService | null>(null);
  const webrtcService = useRef<WebRTCService | null>(null);

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserRequest,
  });

  const resetCall = useCallback(() => {
    setCallState("IDLE");
    setIncomingCall(null);
    setRemoteStream(null);
    currentCallSessionId.current = null;
    roleRef.current = null;
    if (webrtcService.current) {
      webrtcService.current.stop();
      webrtcService.current = null;
    }
  }, []);

  const dismissNotification = useCallback(() => setNotification(null), []);

  useEffect(() => {
    if (!user?.user_id) return;

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const socket = new CallSocketService(url);
    socket.connect(user.user_id);
    socketService.current = socket;

    // ─── Incoming Call ───────────────────────────────────────────────────────
    socket.onIncomingCall((payload) => {
      setIncomingCall(payload);
      setCallState("RINGING");
      currentCallSessionId.current = payload.callSessionId;
    });

    // ─── Call Initiated (Caller only) ─────────────────────────────────────────
    socket.onCallInitiated(({ callSessionId }) => {
      currentCallSessionId.current = callSessionId;
    });

    // ─── Call Accepted ───────────────────────────────────────────────────────
    // Backend sends this to BOTH caller and receiver.
    // Only the caller (role = "caller") should now create & send the SDP offer.
    socket.onCallAccepted(async ({ callSessionId }) => {
      setCallState("IN_CALL");
      currentCallSessionId.current = callSessionId;

      if (roleRef.current === "caller" && webrtcService.current) {
        try {
          // Caller: initialise peer connection then create offer
          webrtcService.current.createPeerConnection();
          const offer = await webrtcService.current.createOffer();
          socket.relaySignal({
            callSessionId,
            signalType: "sdp_offer",
            signalData: offer,
          });
        } catch (err) {
          console.error("Error creating SDP offer", err);
          resetCall();
        }
      }
      // Receiver: peer connection was already set up in acceptCall()
    });

    // ─── Call Rejected ────────────────────────────────────────────────────────
    socket.onCallRejected(({ message }) => {
      resetCall();
      setNotification({ type: "rejected", message: message || "Call was rejected." });
    });

    // ─── Call Ended ───────────────────────────────────────────────────────────
    socket.onCallEnded(() => {
      resetCall();
    });

    // ─── Receiver Busy ────────────────────────────────────────────────────────
    socket.onCallBusy(({ message }) => {
      resetCall();
      setNotification({ type: "busy", message: message || "User is currently busy." });
    });

    // ─── Errors ───────────────────────────────────────────────────────────────
    socket.onCallError(({ message }) => {
      resetCall();
      setNotification({ type: "error", message });
    });

    // ─── WebRTC Signaling Relay ────────────────────────────────────────────────
    socket.onCallSignal(async (payload: RelayCallSignalRequestDTO) => {
      if (!webrtcService.current) return;

      try {
        if (payload.signalType === "sdp_offer") {
          // Receiver: get the offer, create answer, send back
          const answer = await webrtcService.current.handleOffer(payload.signalData);
          socket.relaySignal({
            callSessionId: payload.callSessionId,
            signalType: "sdp_answer",
            signalData: answer,
          });
        } else if (payload.signalType === "sdp_answer") {
          // Caller: set the remote description
          await webrtcService.current.handleAnswer(payload.signalData);
        } else if (payload.signalType === "ice_candidate") {
          await webrtcService.current.handleIceCandidate(payload.signalData);
        }
      } catch (err) {
        console.error("Error handling call signal", err);
      }
    });

    return () => {
      socket.offAll();
      socket.disconnect();
      resetCall();
      socketService.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // ─── Internal helper: spin up WebRTC and grab the mic ─────────────────────
  const initWebRTC = async () => {
    const webrtc = new WebRTCService(
      (candidate) => {
        if (currentCallSessionId.current && socketService.current) {
          socketService.current.relaySignal({
            callSessionId: currentCallSessionId.current,
            signalType: "ice_candidate",
            signalData: candidate,
          });
        }
      },
      (stream) => {
        setRemoteStream(stream);
      }
    );
    await webrtc.startLocalStream();
    webrtcService.current = webrtc;
  };

  // ─── Public API ────────────────────────────────────────────────────────────

  const initiateCall = async (tripId: string, receiverId: string) => {
    if (!socketService.current || callState !== "IDLE") return;
    try {
      await initWebRTC();
      roleRef.current = "caller";
      setCallState("CALLING");
      socketService.current.initiateCall({ tripId, receiverId });
    } catch {
      setNotification({ type: "error", message: "Could not access your microphone." });
      resetCall();
    }
  };

  const acceptCall = async () => {
    if (!socketService.current || !incomingCall) return;
    try {
      await initWebRTC();
      roleRef.current = "receiver";
      // Create peer connection now — the SDP offer from the caller arrives via call-signal
      webrtcService.current!.createPeerConnection();
      socketService.current.acceptCall({ callSessionId: incomingCall.callSessionId });
      setCallState("IN_CALL");
    } catch {
      setNotification({ type: "error", message: "Could not access your microphone." });
      rejectCall();
    }
  };

  const rejectCall = () => {
    if (socketService.current && incomingCall) {
      socketService.current.rejectCall({ callSessionId: incomingCall.callSessionId });
    }
    resetCall();
  };

  const endCall = useCallback(() => {
    if (socketService.current && currentCallSessionId.current) {
      socketService.current.endCall(currentCallSessionId.current);
    }
    resetCall();
  }, [resetCall]);

  return (
    <VoiceCallContext.Provider
      value={{
        callState,
        incomingCall,
        remoteStream,
        notification,
        dismissNotification,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </VoiceCallContext.Provider>
  );
}

export function useVoiceCall() {
  const context = useContext(VoiceCallContext);
  if (context === undefined) {
    throw new Error("useVoiceCall must be used within a VoiceCallProvider");
  }
  return context;
}
