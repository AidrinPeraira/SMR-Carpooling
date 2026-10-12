"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Avatar, useToast } from "@sharemyride/ui";
import {
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  JourneyStatus,
  JourneyStopResult,
  DriverJourneyPassengerResult,
  PassengerJourneyStatus,
  StopType,
} from "@sharemyride/shared";
import { driverArrivedRequest } from "@/features/driver/journey/api/driverArrivedRequest";
import { driverVerifyPickupRequest } from "@/features/driver/journey/api/driverVerifyPickupRequest";

interface CurrentTargetCardProps {
  journeyId: string;
  journeyStatus: JourneyStatus;
  intermediateStops: JourneyStopResult[];
  passengers: DriverJourneyPassengerResult[];
}

export function CurrentTargetCard({
  journeyId,
  journeyStatus,
  intermediateStops,
  passengers,
}: CurrentTargetCardProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const nextStop = intermediateStops.find((stop) => {
    const passenger = passengers.find(
      (p) => p.passenger_id === stop.passenger_id,
    );
    if (!passenger) return false;
    if (
      stop.stop_type === StopType.PICKUP &&
      passenger.passenger_status === PassengerJourneyStatus.NOT_BOARDED
    )
      return true;
    if (
      stop.stop_type === StopType.DROPOFF &&
      passenger.passenger_status === PassengerJourneyStatus.PICKED_UP
    )
      return true;
    return false;
  });

  const nextPassenger = nextStop
    ? passengers.find((p) => p.passenger_id === nextStop.passenger_id)
    : null;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otp];
    for (let i = 0; i < 4; i++) {
      next[i] = pasted[i] ?? "";
    }
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 3);
    otpRefs.current[focusIndex]?.focus();
  };

  const verifyPickupMutation = useMutation({
    mutationFn: async () => {
      if (!nextStop) throw new Error("No stop selected");
      const code = otp.join("");
      if (code.length !== 4) throw new Error("Please enter the full 4-digit OTP");
      await driverVerifyPickupRequest({
        journey_id: journeyId,
        passenger_id: nextStop.passenger_id,
        pickup_otp: code,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["driverJourneyDetails", journeyId],
      });
      toast("Pickup verified", { variant: "success" });
      setOtp(["", "", "", ""]);
    },
    onError: (err: unknown) => {
      toast(
        err instanceof Error ? err.message : "Failed to verify OTP",
        { variant: "error" },
      );
      setOtp(["", "", "", ""]);
      otpRefs.current[0]?.focus();
    },
  });

  const arrivedMutation = useMutation({
    mutationFn: async () => {
      if (!nextStop) throw new Error("No stop selected");

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (err) => {
              const messages: Record<number, string> = {
                1: "Location permission denied. Please enable location access.",
                2: "Unable to determine your location. Please try again.",
                3: "Location request timed out. Please try again.",
              };
              reject(new Error(messages[err.code] ?? "Failed to get location"));
            },
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 1000,
            },
          );
        },
      );

      await driverArrivedRequest({
        journey_id: journeyId,
        passenger_id: nextStop.passenger_id,
        stop_type: nextStop.stop_type,
        arrived_lat: position.coords.latitude,
        arrived_lng: position.coords.longitude,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["driverJourneyDetails", journeyId],
      });
      toast("Arrival confirmed", { variant: "success" });
    },
    onError: (err: unknown) => {
      console.log(err);
      toast(err instanceof Error ? err.message : "Failed to confirm arrival", {
        variant: "error",
      });
    },
  });

  if (!nextStop || !nextPassenger || journeyStatus !== JourneyStatus.ONGOING) {
    return null;
  }

  const hasArrived = nextStop.arrived_at !== null;
  const isPickup = nextStop.stop_type === StopType.PICKUP;
  const initials = nextPassenger.passenger_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-4 border-2 border-accent relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-accent text-accent-fg text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
        Current Target
      </div>

      <div className="pr-20">
        <span className="text-[10px] font-bold text-accent tracking-wider uppercase">
          Next: {isPickup ? "Pickup" : "Drop-off"}
        </span>
        <h2 className="text-sm font-bold text-content-primary mt-0.5">
          {nextStop.stop_name}
        </h2>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-content-secondary">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{nextStop.stop_address}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} size="sm" />
          <div>
            <p className="text-sm font-bold text-content-primary">
              {nextPassenger.passenger_name}
            </p>
            <p className="text-[10px] text-content-secondary font-medium">
              {hasArrived
                ? isPickup
                  ? "Waiting for OTP"
                  : "Ready to drop off"
                : isPickup
                  ? "Awaiting pickup"
                  : "Onboard"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-secondary flex items-center justify-center text-content-primary transition-colors"
            title={`Call ${nextPassenger.passenger_name}`}
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-secondary flex items-center justify-center text-content-primary transition-colors"
            title={`Chat with ${nextPassenger.passenger_name}`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!hasArrived && (
        <Button
          variant="primary"
          className="mt-4 w-full py-2.5 rounded-full flex items-center justify-center gap-2 font-bold"
          onClick={() => arrivedMutation.mutate()}
          disabled={arrivedMutation.isPending}
        >
          {arrivedMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>
            {arrivedMutation.isPending
              ? "Confirming location..."
              : isPickup
                ? "Arrived at Pickup"
                : "Arrived at Drop-off"}
          </span>
        </Button>
      )}

      {hasArrived && isPickup && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold text-content-secondary text-center">
            Enter the 4-digit OTP from the passenger
          </p>
          <div className="flex items-center justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border-strong bg-surface-muted text-content-primary focus:border-accent focus:outline-none transition-colors"
                disabled={verifyPickupMutation.isPending}
              />
            ))}
          </div>
          <Button
            variant="primary"
            className="w-full py-2.5 rounded-full flex items-center justify-center gap-2 font-bold"
            onClick={() => verifyPickupMutation.mutate()}
            disabled={otp.join("").length !== 4 || verifyPickupMutation.isPending}
          >
            {verifyPickupMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>
              {verifyPickupMutation.isPending
                ? "Verifying..."
                : "Verify Pickup"}
            </span>
          </Button>
        </div>
      )}

      {hasArrived && !isPickup && (
        <Button
          variant="primary"
          className="mt-4 w-full py-2.5 rounded-full flex items-center justify-center gap-2 font-bold"
          disabled
        >
          <LogOut className="w-4 h-4" />
          <span>Confirm Drop-off</span>
        </Button>
      )}
    </Card>
  );
}
