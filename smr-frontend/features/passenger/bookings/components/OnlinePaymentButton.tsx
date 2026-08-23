"use client";

import { useState } from "react";
import { Button, Dialog } from "@sharemyride/ui";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createBookingPaymentOrderRequest } from "@/features/passenger/bookings/api/createBookingPaymentOrderRequest";
import { verifyBookingPaymentRequest } from "@/features/passenger/bookings/api/verifyBookingPaymentRequest";
import { initiateBookingPaymentRequest } from "@/features/passenger/bookings/api/initiateBookingPaymentRequest";

interface OnlinePaymentButtonProps {
  bookingId: string;
  amount: number;
}

export function OnlinePaymentButton({
  bookingId,
  amount,
}: OnlinePaymentButtonProps) {
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
      const { payment_token } = await initiateBookingPaymentRequest(bookingId);
      const { order_number } = await createBookingPaymentOrderRequest({
        payment_token,
      });

      //razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: amount * 100, //Rupees to paise
        currency: "INR",
        name: "ShareMyRide",
        description: "Booking Payment",
        order_id: order_number,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyBookingPaymentRequest({
              order_number: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              verification_key: response.razorpay_signature,
            });

            setResultDialog({
              isOpen: true,
              success: true,
              message: "Payment was successful! Your booking is confirmed.",
            });
          } catch (verifyError: any) {
            setResultDialog({
              isOpen: true,
              success: false,
              message: verifyError.message || "Payment verification failed.",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        theme: {
          color: "#4f46e5", // using a generic accent color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setResultDialog({
          isOpen: true,
          success: false,
          message: response.error.description || "Payment failed.",
        });
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error: any) {
      setResultDialog({
        isOpen: true,
        success: false,
        message: error.message || "An error occurred during payment.",
      });
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
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
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
        rejectAction={closeResultDialog}
      />
    </>
  );
}
