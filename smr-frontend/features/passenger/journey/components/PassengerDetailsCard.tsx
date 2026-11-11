"use client";

import { Card, CardBody, Button, useToast } from "@sharemyride/ui";
import { PassengerOwnDetailsResult, PassengerJourneyStatus } from "@sharemyride/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Navigation, KeyRound, Loader2, ShieldCheck, CircleCheckBig } from "lucide-react";
import { CallButton } from "@/features/call/CallButton";
import { passengerConfirmPickupRequest } from "../api/passengerConfirmPickupRequest";

interface PassengerDetailsCardProps {
  journeyId: string;
  driverId: string;
  myDetails: PassengerOwnDetailsResult;
}

export function PassengerDetailsCard({ journeyId, driverId, myDetails }: PassengerDetailsCardProps) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const isAwaitingPickup =
    myDetails.passenger_status === PassengerJourneyStatus.NOT_BOARDED;

  const confirmPickupMutation = useMutation({
    mutationFn: async () => {
      await passengerConfirmPickupRequest({ journey_id: journeyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passengerJourneyDetails", journeyId] });
      toast("Pickup confirmed", { variant: "success" });
    },
    onError: (err: unknown) => {
      toast(err instanceof Error ? err.message : "Failed to confirm pickup", { variant: "error" });
    },
  });

  return (
    <Card className="border-2 border-accent bg-surface-card shadow-sm">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-content-primary">
            Your Journey Details
          </h3>
          {isAwaitingPickup && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning-surface text-warning-content border border-warning-border">
              <span className="w-1.5 h-1.5 rounded-full bg-warning-content animate-pulse" />
              AWAITING PICKUP
            </span>
          )}
        </div>

        <CallButton
          tripId={journeyId}
          receiverId={driverId}
          variant="secondary"
          className="w-full text-xs py-2 font-medium"
          showText
          label="Call Driver"
        />

        {/* Pickup Location */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 text-accent mt-0.5">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
              Pickup Location
            </p>
            <p className="font-bold text-sm text-content-primary">
              {myDetails.pickup_location.stop_name}
            </p>
            <p className="text-xs text-content-secondary">
              {myDetails.pickup_location.stop_address}
            </p>
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="border-t border-border-subtle pt-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-error-surface flex items-center justify-center flex-shrink-0 text-error-content mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
              Drop-off Location
            </p>
            <p className="font-bold text-sm text-content-primary">
              {myDetails.drop_off_location.stop_name}
            </p>
            <p className="text-xs text-content-secondary">
              {myDetails.drop_off_location.stop_address}
            </p>
          </div>
        </div>

        {/* OTP & Confirm Pickup Section */}
        {myDetails.pickup_otp && isAwaitingPickup && (
          <div className="border-t border-border-subtle pt-3 space-y-3">
            <div className="bg-surface-muted rounded-lg p-3 flex items-center gap-3 border border-border-subtle">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 text-accent">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-content-secondary">
                  Pickup Verification PIN
                </p>
                <p className="text-xl font-bold text-content-primary tracking-[0.3em] mt-0.5">
                  {myDetails.pickup_otp}
                </p>
                <p className="text-[10px] text-content-secondary mt-0.5">
                  Share this PIN with the driver when boarding
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-2.5 rounded-full flex items-center justify-center gap-2 font-bold"
              onClick={() => confirmPickupMutation.mutate()}
              disabled={confirmPickupMutation.isPending}
            >
              {confirmPickupMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>
                {confirmPickupMutation.isPending ? "Confirming..." : "Confirm Pickup"}
              </span>
            </Button>
            <p className="text-[10px] text-content-secondary text-center">
              Tap to confirm the driver has verified your PIN
            </p>
          </div>
        )}

        {myDetails.passenger_status === PassengerJourneyStatus.PICKED_UP && (
          <div className="border-t border-border-subtle pt-3">
            <div className="bg-success-surface rounded-lg p-3 flex items-center gap-3 border border-success-border">
              <div className="w-8 h-8 rounded-full bg-success-content/15 flex items-center justify-center flex-shrink-0 text-success-content">
                <CircleCheckBig className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-success-content">
                  Driver confirmed
                </p>
                <p className="text-xs text-success-content/80 mt-0.5">
                  Enjoy your journey!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
