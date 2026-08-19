"use client";

import { Button, Card, CardBody, Tag } from "@sharemyride/ui";
import { AlertCircle, CreditCard, ShieldCheck, XCircle } from "lucide-react";
import { OnlinePaymentButton } from "./OnlinePaymentButton";

interface BookingDetailsActionCardProps {
  bookingId: string;
  status: string;
  onWithdraw: () => Promise<void>;
  isWithdrawing: boolean;
}

export function BookingDetailsActionCard({
  bookingId,
  status,
  onWithdraw,
  isWithdrawing,
}: BookingDetailsActionCardProps) {
  const normalizedStatus = status.toLowerCase();

  // Case 1: Status is 'requested' -> Show button to withdraw booking request
  if (normalizedStatus === "requested") {
    return (
      <Card className="border border-warning-border bg-warning-surface shadow-sm">
        <CardBody className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning-content flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-warning-content">
                Booking Request Pending
              </h4>
              <p className="text-xs text-warning-content/80">
                Your request has been submitted to the driver. You can withdraw
                your request anytime before the driver accepts it.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            className="w-full text-xs py-2 font-medium"
            disabled={isWithdrawing}
            onClick={onWithdraw}
          >
            {isWithdrawing
              ? "Withdrawing Request..."
              : "Withdraw Booking Request"}
          </Button>
        </CardBody>
      </Card>
    );
  }

  // Case 2: Status is 'payment_pending' -> Show card to proceed to payment
  if (normalizedStatus === "payment_pending") {
    return (
      <Card className="border border-accent/30 bg-accent/10 shadow-sm">
        <CardBody className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-content-primary">
                Driver Accepted - Payment Pending
              </h4>
              <p className="text-xs text-content-secondary">
                The driver accepted your booking request! Complete payment to
                confirm your seat reservation.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <OnlinePaymentButton bookingId={bookingId} />
            <Button
              variant="secondary"
              className="w-full text-xs py-2 font-medium"
            >
              Pay with Wallet
            </Button>
            <Button
              variant="danger"
              className="w-full text-xs py-2 font-medium"
              disabled={isWithdrawing}
              onClick={onWithdraw}
            >
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Case 3: Everything else ('confirmed', 'rejected', 'cancelled', etc.) -> No action to be taken
  return (
    <Card className="border border-border-subtle bg-surface-card shadow-sm">
      <CardBody className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {normalizedStatus === "confirmed" ? (
            <ShieldCheck className="w-5 h-5 text-success-content flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-content-secondary flex-shrink-0" />
          )}
          <div>
            <h4 className="font-semibold text-xs text-content-primary">
              {normalizedStatus === "confirmed"
                ? "Booking Confirmed"
                : `Booking Status: ${status.toUpperCase()}`}
            </h4>
            <p className="text-[11px] text-content-secondary mt-0.5">
              {normalizedStatus === "confirmed"
                ? "Your seat is confirmed. Enjoy your ride!"
                : "No further action can be taken for this booking."}
            </p>
          </div>
        </div>

        <Tag variant="muted" className="text-[10px]">
          NO ACTION REQUIRED
        </Tag>
      </CardBody>
    </Card>
  );
}
