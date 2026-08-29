"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PhoneCall, PhoneOff, Phone, X, Mic, MicOff } from "lucide-react";
import { useVoiceCall } from "../context/VoiceCallContext";
import { useState } from "react";

// ─── Incoming Call Overlay ──────────────────────────────────────────────────
function IncomingCallOverlay() {
  const { incomingCall, acceptCall, rejectCall } = useVoiceCall();

  if (!incomingCall) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Incoming voice call"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card — full-screen bottom sheet on mobile, centred dialog on sm+ */}
      <div
        className={[
          "relative z-10 w-full sm:w-auto sm:min-w-[360px] sm:max-w-sm",
          "bg-surface-card border border-border-strong rounded-t-3xl sm:rounded-2xl",
          "shadow-2xl flex flex-col items-center gap-6 p-8 pb-10 sm:p-8",
          "animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300",
        ].join(" ")}
      >
        {/* Pulse ring */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-20 w-20 rounded-full bg-accent/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center">
            <Phone className="w-9 h-9 text-accent" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-content-secondary">
            Incoming Voice Call
          </p>
          <h2 className="text-2xl font-bold text-content-primary">Trip Partner</h2>
          <p className="text-sm text-content-secondary">
            Calling about your active trip
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-4 mt-2">
          <button
            onClick={rejectCall}
            className="flex-1 flex flex-col items-center gap-2 group"
            aria-label="Decline call"
          >
            <span className="w-14 h-14 rounded-full bg-error-surface border border-error-border flex items-center justify-center group-hover:bg-error-content/10 transition-colors">
              <PhoneOff className="w-6 h-6 text-error-content" />
            </span>
            <span className="text-xs font-medium text-error-content">Decline</span>
          </button>

          <button
            onClick={acceptCall}
            className="flex-1 flex flex-col items-center gap-2 group"
            aria-label="Accept call"
          >
            <span className="w-14 h-14 rounded-full bg-success-surface border border-success-border flex items-center justify-center group-hover:bg-success-content/10 transition-colors">
              <PhoneCall className="w-6 h-6 text-success-content" />
            </span>
            <span className="text-xs font-medium text-success-content">Accept</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Active / Calling Status Bar ────────────────────────────────────────────
function ActiveCallBar() {
  const { callState, endCall, remoteStream } = useVoiceCall();
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch(console.error);
    }
  }, [remoteStream]);

  if (callState !== "CALLING" && callState !== "IN_CALL") return null;

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted((m) => !m);
  };

  return createPortal(
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} autoPlay playsInline className="hidden" />

      {/* Floating bar */}
      <div
        className={[
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998]",
          "flex items-center gap-3 px-5 py-3",
          "bg-surface-card border border-border-strong rounded-full shadow-2xl",
          "animate-in slide-in-from-bottom-4 fade-in duration-300",
        ].join(" ")}
      >
        {/* Status dot */}
        <span
          className={[
            "w-2 h-2 rounded-full",
            callState === "IN_CALL"
              ? "bg-success-content animate-pulse"
              : "bg-warning-content animate-pulse",
          ].join(" ")}
        />

        <span className="text-sm font-semibold text-content-primary">
          {callState === "CALLING" ? "Calling…" : "Connected"}
        </span>

        {/* Divider */}
        <div className="w-px h-5 bg-border-subtle" />

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <MicOff className="w-4 h-4 text-error-content" />
          ) : (
            <Mic className="w-4 h-4 text-content-secondary" />
          )}
        </button>

        {/* End call */}
        <button
          onClick={endCall}
          className="w-9 h-9 rounded-full bg-error-surface border border-error-border flex items-center justify-center hover:bg-error-content/10 transition-colors"
          aria-label="End call"
          title="End call"
        >
          <PhoneOff className="w-4 h-4 text-error-content" />
        </button>
      </div>
    </>,
    document.body
  );
}

// ─── Call Notification Toast ─────────────────────────────────────────────────
function CallNotificationToast() {
  const { notification, dismissNotification } = useVoiceCall();

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(dismissNotification, 5000);
    return () => clearTimeout(t);
  }, [notification, dismissNotification]);

  if (!notification) return null;

  const colours = {
    rejected: "border-error-border bg-error-surface text-error-content",
    busy: "border-warning-border bg-warning-surface text-warning-content",
    error: "border-error-border bg-error-surface text-error-content",
  };

  return createPortal(
    <div
      className={[
        "fixed top-4 right-4 z-[9999] max-w-sm flex items-start gap-3",
        "rounded-xl border px-4 py-3 shadow-xl",
        "animate-in slide-in-from-top-4 fade-in duration-300",
        colours[notification.type],
      ].join(" ")}
      role="alert"
    >
      <span className="flex-1 text-sm font-medium">{notification.message}</span>
      <button onClick={dismissNotification} className="shrink-0 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
}

// ─── Composed export ─────────────────────────────────────────────────────────
export function CallModals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <IncomingCallOverlay />
      <ActiveCallBar />
      <CallNotificationToast />
    </>
  );
}
