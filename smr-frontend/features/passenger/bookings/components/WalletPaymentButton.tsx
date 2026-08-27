"use client";

import { useState } from "react";
import { Button, Dialog } from "@sharemyride/ui";
import { useRouter } from "next/navigation";
import { initiateBookingPaymentRequest } from "@/features/passenger/bookings/api/initiateBookingPaymentRequest";
import { payWithWalletRequest } from "@/features/passenger/bookings/api/payWithWalletRequest";
import { useQueryClient } from "@tanstack/react-query";

interface WalletPaymentButtonProps {
  bookingId: string;
}

export function WalletPaymentButton({ bookingId }: WalletPaymentButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    success: boolean;
    message: string;
  }>({
    isOpen: false,
    success: false,
    message: "",
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleWalletPayment = async () => {
    setIsConfirmOpen(false);
    setIsProcessing(true);

    try {
      const { payment_token } = await initiateBookingPaymentRequest(bookingId);
      
      await payWithWalletRequest({ payment_token });

      setResultDialog({
        isOpen: true,
        success: true,
        message: "Payment was successful! Your booking is confirmed.",
      });
    } catch (error: unknown) {
      setResultDialog({
        isOpen: true,
        success: false,
        message: error instanceof Error ? error.message : "An error occurred during wallet payment.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const closeResultDialog = () => {
    setResultDialog((prev) => ({ ...prev, isOpen: false }));
    queryClient.invalidateQueries({ queryKey: ["passengerBookings"] });
    queryClient.invalidateQueries({ queryKey: ["passengerBookingDetails", bookingId] });
    if (resultDialog.success) {
      router.refresh();
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        className="w-full text-xs py-2 font-medium"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing Wallet Payment..." : "Pay with Wallet"}
      </Button>

      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        header="Confirm Wallet Payment"
        description="Are you sure you want to proceed with wallet payment for this booking?"
        confirmAction={handleWalletPayment}
        rejectAction={() => setIsConfirmOpen(false)}
      />

      <Dialog
        isOpen={resultDialog.isOpen}
        onClose={closeResultDialog}
        header={resultDialog.success ? "Payment Successful" : "Payment Failed"}
        description={resultDialog.message}
        confirmAction={closeResultDialog}
        rejectAction={closeResultDialog}
      />
    </>
  );
}
