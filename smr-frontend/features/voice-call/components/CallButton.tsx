"use client";

import { Button } from "@sharemyride/ui";
import { Phone } from "lucide-react";
import { useVoiceCall } from "../context/VoiceCallContext";

interface CallButtonProps {
  tripId: string;
  receiverId: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  showText?: boolean;
}

export function CallButton({
  tripId,
  receiverId,
  variant = "primary",
  className,
  showText = false,
}: CallButtonProps) {
  const { initiateCall, callState } = useVoiceCall();

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    void initiateCall(tripId, receiverId);
  };

  const isBusy = callState !== "IDLE";

  return (
    <Button
      variant={variant}
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      onClick={handleCall}
      disabled={isBusy}
      title="Start voice call"
    >
      <Phone className="w-4 h-4" />
      {showText && <span>{isBusy ? "Busy" : "Call"}</span>}
    </Button>
  );
}
