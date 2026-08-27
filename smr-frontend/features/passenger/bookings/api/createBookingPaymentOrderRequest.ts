import { apiClientFetch } from "@/lib/api-client";
import { CreateBookingPaymentOrderRequest, CreateBookingPaymentOrderResult } from "@sharemyride/shared";

export async function createBookingPaymentOrderRequest(
  data: CreateBookingPaymentOrderRequest,
): Promise<CreateBookingPaymentOrderResult> {
  const response = await apiClientFetch<CreateBookingPaymentOrderResult>(
    "/api/v1/payments/booking/order",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(response.message || "Failed to create booking payment order");
}
