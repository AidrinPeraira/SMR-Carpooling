"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useCallSocket } from "@/features/realtime/hooks/useCallSocket";
import { VoiceCallContext } from "@/features/realtime/context/VoiceCallContext";
import {
  CallState,
  IncomingCall,
  CallNotification,
} from "@/features/realtime/types/VoiceCallTypes";
import {
  SocketEvents,
  CallSignalType,
  InitiateCallOutgoingPayload,
  InitiateCallConfirmationPayload,
  AcceptCallCallerPayload,
  AcceptCallReceiverPayload,
  RejectCallPayload,
  CallTimeoutPayload,
  EndCallPayload,
  RelayCallSignalPayload,
} from "@sharemyride/shared";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const RING_TIMEOUT_MS = 30_000;

export function VoiceCallProvider({ children }: { children: ReactNode }) {
  const callSocket = useCallSocket();

  const [callState, setCallState] = useState<CallState>("IDLE");
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [notification, setNotification] = useState<CallNotification | null>(
    null,
  );

  const sessionIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  const cleanup = useCallback(() => {
    if (ringTimerRef.current) {
      clearTimeout(ringTimerRef.current);
      ringTimerRef.current = null;
    }
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setRemoteStream(null);
    sessionIdRef.current = null;
    iceCandidateQueue.current = [];
    setIncomingCall(null);
    setCallState("IDLE");
  }, []);

  const showNotification = useCallback(
    (type: CallNotification["type"], message: string) => {
      setNotification({ type, message });
    },
    [],
  );

  const dismissNotification = useCallback(() => setNotification(null), []);

  const createPeerConnection = useCallback(
    (callSessionId: string) => {
      const pc = new RTCPeerConnection(RTC_CONFIG);

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          callSocket.emit(SocketEvents.CALL_SIGNAL, {
            call_session_id: callSessionId,
            signal_type: CallSignalType.ICE_CANDIDATE,
            signal_data: e.candidate,
          });
        }
      };

      pc.ontrack = (e) => {
        setRemoteStream(e.streams[0] ?? null);
      };

      pcRef.current = pc;
      return pc;
    },
    [callSocket],
  );

  const acquireMic = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    return stream;
  }, []);

  // --- actions ---

  const initiateCall = useCallback(
    (tripId: string, receiverId: string) => {
      if (callState !== "IDLE") return;

      setCallState("CALLING");
      callSocket.emit(SocketEvents.CALL_INITIATED, {
        trip_id: tripId,
        caller_id: "",
        receiver_id: receiverId,
      });

      ringTimerRef.current = setTimeout(() => {
        if (sessionIdRef.current) {
          callSocket.emit(SocketEvents.CALL_NO_ANSWER, {
            call_session_id: sessionIdRef.current,
          });
        }
        showNotification("error", "No answer");
        cleanup();
      }, RING_TIMEOUT_MS);
    },
    [callState, callSocket, cleanup, showNotification],
  );

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    const { callSessionId } = incomingCall;

    try {
      const stream = await acquireMic();
      const pc = createPeerConnection(callSessionId);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      callSocket.emit(SocketEvents.CALL_ACCEPTED, {
        call_session_id: callSessionId,
      });

      setCallState("IN_CALL");
      setIncomingCall(null);
    } catch {
      showNotification("error", "Could not access microphone");
      cleanup();
    }
  }, [
    incomingCall,
    callSocket,
    acquireMic,
    createPeerConnection,
    cleanup,
    showNotification,
  ]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    callSocket.emit(SocketEvents.CALL_REJECTED, {
      call_session_id: incomingCall.callSessionId,
    });
    cleanup();
  }, [incomingCall, callSocket, cleanup]);

  const endCall = useCallback(() => {
    if (!sessionIdRef.current) return;
    callSocket.emit(SocketEvents.CALL_ENDED, {
      call_session_id: sessionIdRef.current,
    });
    cleanup();
  }, [callSocket, cleanup]);

  // --- socket listeners ---

  useEffect(() => {
    const onCallInitiated = (data: InitiateCallConfirmationPayload) => {
      sessionIdRef.current = data.call_session_id;
    };

    const onCallIncoming = (data: InitiateCallOutgoingPayload) => {
      if (callState !== "IDLE") return;
      sessionIdRef.current = data.call_session_id;
      setIncomingCall({
        callSessionId: data.call_session_id,
        callerId: data.caller_id,
        tripId: data.trip_id,
      });
      setCallState("RINGING");
    };

    const onCallAccepted = async (
      data: AcceptCallCallerPayload | AcceptCallReceiverPayload,
    ) => {
      if (ringTimerRef.current) {
        clearTimeout(ringTimerRef.current);
        ringTimerRef.current = null;
      }

      const callSessionId = data.call_session_id;

      if ("receiver_id" in data) {
        try {
          const stream = await acquireMic();
          const pc = createPeerConnection(callSessionId);
          stream.getTracks().forEach((t) => pc.addTrack(t, stream));

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          callSocket.emit(SocketEvents.CALL_SIGNAL, {
            call_session_id: callSessionId,
            signal_type: CallSignalType.OFFER,
            signal_data: offer,
          });

          setCallState("IN_CALL");
        } catch {
          showNotification("error", "Could not access microphone");
          cleanup();
        }
      } else {
        setCallState("IN_CALL");
      }
    };

    const onCallRejected = (_data: RejectCallPayload) => {
      showNotification("rejected", "Call was declined");
      cleanup();
    };

    const onCallNoAnswer = (_data: CallTimeoutPayload) => {
      showNotification("error", "No answer");
      cleanup();
    };

    const onCallMissed = (_data: CallTimeoutPayload) => {
      cleanup();
    };

    const onCallEnded = (_data: EndCallPayload) => {
      cleanup();
    };

    const flushIceCandidates = async (pc: RTCPeerConnection) => {
      const queued = iceCandidateQueue.current;
      iceCandidateQueue.current = [];
      for (const candidate of queued) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const onCallSignal = async (data: RelayCallSignalPayload) => {
      const pc = pcRef.current;
      if (!pc) return;

      if (data.signal_type === CallSignalType.OFFER) {
        await pc.setRemoteDescription(
          new RTCSessionDescription(
            data.signal_data as RTCSessionDescriptionInit,
          ),
        );
        await flushIceCandidates(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        callSocket.emit(SocketEvents.CALL_SIGNAL, {
          call_session_id: data.call_session_id,
          signal_type: CallSignalType.ANSWER,
          signal_data: answer,
        });
      } else if (data.signal_type === CallSignalType.ANSWER) {
        await pc.setRemoteDescription(
          new RTCSessionDescription(
            data.signal_data as RTCSessionDescriptionInit,
          ),
        );
        await flushIceCandidates(pc);
      } else if (data.signal_type === CallSignalType.ICE_CANDIDATE) {
        if (!pc.remoteDescription) {
          iceCandidateQueue.current.push(
            data.signal_data as RTCIceCandidateInit,
          );
        } else {
          await pc.addIceCandidate(
            new RTCIceCandidate(data.signal_data as RTCIceCandidateInit),
          );
        }
      }
    };

    const onCallError = (data: { message: string }) => {
      showNotification("error", data.message);
      cleanup();
    };

    callSocket.on(SocketEvents.CALL_INITIATED, onCallInitiated);
    callSocket.on(SocketEvents.CALL_INCOMING, onCallIncoming);
    callSocket.on(SocketEvents.CALL_ACCEPTED, onCallAccepted);
    callSocket.on(SocketEvents.CALL_REJECTED, onCallRejected);
    callSocket.on(SocketEvents.CALL_NO_ANSWER, onCallNoAnswer);
    callSocket.on(SocketEvents.CALL_MISSED, onCallMissed);
    callSocket.on(SocketEvents.CALL_ENDED, onCallEnded);
    callSocket.on(SocketEvents.CALL_SIGNAL, onCallSignal);
    callSocket.on(SocketEvents.CALL_ERROR, onCallError);

    return () => {
      callSocket.off(SocketEvents.CALL_INITIATED, onCallInitiated);
      callSocket.off(SocketEvents.CALL_INCOMING, onCallIncoming);
      callSocket.off(SocketEvents.CALL_ACCEPTED, onCallAccepted);
      callSocket.off(SocketEvents.CALL_REJECTED, onCallRejected);
      callSocket.off(SocketEvents.CALL_NO_ANSWER, onCallNoAnswer);
      callSocket.off(SocketEvents.CALL_MISSED, onCallMissed);
      callSocket.off(SocketEvents.CALL_ENDED, onCallEnded);
      callSocket.off(SocketEvents.CALL_SIGNAL, onCallSignal);
      callSocket.off(SocketEvents.CALL_ERROR, onCallError);
    };
  }, [
    callSocket,
    callState,
    acquireMic,
    createPeerConnection,
    cleanup,
    showNotification,
  ]);

  return (
    <VoiceCallContext.Provider
      value={{
        callState,
        incomingCall,
        remoteStream,
        notification,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        dismissNotification,
      }}
    >
      {children}
    </VoiceCallContext.Provider>
  );
}
