"use client";

import { useState } from "react";
import { Button, Dialog } from "@sharemyride/ui";
import { useRouter } from "next/navigation";
import { initiateBookingPaymentRequest } from "@/features/passenger/bookings/api/initiateBookingPaymentRequest";
import { createBookingPaymentOrderRequest } from "@/features/passenger/bookings/api/createBookingPaymentOrderRequest";
import { verifyBookingPaymentRequest } from "@/features/passenger/bookings/api/verifyBookingPaymentRequest";

interface OnlinePaymentButtonProps {
  bookingId: string;
}

export function OnlinePaymentButton({ bookingId }: OnlinePaymentButtonProps) {
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

  const handleOnlinePayment = async () => {
    setIsConfirmOpen(false);
    setIsProcessing(true);

    try {
      // 1. Initiate payment request
      const { payment_token } = await initiateBookingPaymentRequest(bookingId);

      // 2. Create booking order number
      const { order_number } = await createBookingPaymentOrderRequest({
        payment_token,
      });

      // 3. Verify successful payment
      // Note: Razorpay is not implemented yet.
      // In a real flow, Razorpay checkout would be here.
      // We will mock the verify payment request with dummy values.
      await verifyBookingPaymentRequest({
        order_number,
        payment_id: "mock_payment_id_" + Date.now(),
        verification_key: "mock_verification_key",
      });

      setResultDialog({
        isOpen: true,
        success: true,
        message: "Payment was successful! Your booking is confirmed.",
      });
    } catch (error: any) {
      setResultDialog({
        isOpen: true,
        success: false,
        message: error.message || "An error occurred during payment.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const closeResultDialog = () => {
    setResultDialog((prev) => ({ ...prev, isOpen: false }));
    if (resultDialog.success) {
      router.refresh();
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className="w-full text-xs py-2 font-medium"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Online"}
      </Button>

      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        header="Confirm Payment"
        description="Are you sure you want to proceed with online payment for this booking?"
        confirmAction={handleOnlinePayment}
        rejectAction={() => setIsConfirmOpen(false)}
      />

      <Dialog
        isOpen={resultDialog.isOpen}
        onClose={closeResultDialog}
        header={resultDialog.success ? "Payment Successful" : "Payment Failed"}
        description={resultDialog.message}
        confirmAction={closeResultDialog}
        rejectAction={closeResultDialog} // Required to also close when reject is clicked
      />
    </>
  );
}
