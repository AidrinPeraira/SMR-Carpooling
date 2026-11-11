import { apiClientFetch } from "@/lib/api-client";
import { VerifyBookingPaymentOrderRequest } from "@sharemyride/shared";

export async function verifyBookingPaymentRequest(
  data: VerifyBookingPaymentOrderRequest,
): Promise<void> {
  const response = await apiClientFetch(
    "/api/v1/payments/booking/verify",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to verify booking payment");
  }
}
