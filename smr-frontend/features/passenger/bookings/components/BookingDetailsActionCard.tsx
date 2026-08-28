"use client";

import { Button, Card, CardBody, Tag } from "@sharemyride/ui";
import {
  AlertCircle,
  CreditCard,
  ShieldCheck,
  XCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import { OnlinePaymentButton } from "./OnlinePaymentButton";
import { WalletPaymentButton } from "./WalletPaymentButton";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface BookingDetailsActionCardProps {
  bookingId: string;
  amount: number;
  status: string;
  onWithdraw: () => Promise<void>;
  isWithdrawing: boolean;
  onCancel?: () => Promise<void>;
  isCancelling?: boolean;
  tripId?: string;
}

export function BookingDetailsActionCard({
  bookingId,
  amount,
  status,
  onWithdraw,
  isWithdrawing,
  onCancel,
  isCancelling = false,
  tripId,
}: BookingDetailsActionCardProps) {
  const queryClient = useQueryClient();
  const normalizedStatus = status.toLowerCase();

  const handleWithdraw = async () => {
    await onWithdraw();
    queryClient.invalidateQueries({ queryKey: ["passengerBookings"] });
  };

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel();
      queryClient.invalidateQueries({ queryKey: ["passengerBookings"] });
    }
  };

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
            onClick={handleWithdraw}
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
  if (
    normalizedStatus === "payment_pending" ||
    normalizedStatus === "payment_failed"
  ) {
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
            <OnlinePaymentButton bookingId={bookingId} amount={amount} />
            <WalletPaymentButton bookingId={bookingId} />
            <Button
              variant="danger"
              className="w-full text-xs py-2 font-medium"
              disabled={isWithdrawing}
              onClick={handleWithdraw}
            >
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Case 3: Confirmed status -> Show actions (Chat, Call, Cancel)
  if (normalizedStatus === "confirmed") {
    return (
      <Card className="border border-success/30 bg-success/5 shadow-sm">
        <CardBody className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success-content flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-content-primary">
                Booking Confirmed
              </h4>
              <p className="text-xs text-content-secondary">
                Your seat is confirmed. Enjoy your ride! You can chat with your
                driver or other passengers.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
            <Link
              href={`/passenger/bookings/${bookingId}/chat${tripId ? `?tripId=${tripId}` : ''}`}
              className="w-full sm:flex-1"
            >
              <Button
                variant="secondary"
                className="w-full text-xs py-2 font-medium flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="w-full sm:flex-1 text-xs py-2 font-medium flex items-center justify-center gap-2"
              onClick={() => alert("Call feature coming soon!")}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
          </div>

          <Button
            variant="danger"
            className="w-full text-xs py-2 font-medium"
            disabled={isCancelling}
            onClick={handleCancel}
          >
            {isCancelling ? "Cancelling Booking..." : "Cancel Booking"}
          </Button>
        </CardBody>
      </Card>
    );
  }

  // Case 4: Everything else ('rejected', 'cancelled', etc.) -> No action to be taken
  return (
    <Card className="border border-border-subtle bg-surface-card shadow-sm">
      <CardBody className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-content-secondary flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-xs text-content-primary">
              Booking Status: {status.toUpperCase()}
            </h4>
            <p className="text-[11px] text-content-secondary mt-0.5">
              No further action can be taken for this booking.
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
