import { apiClientFetch } from "@/lib/api-client";
import { PayBookingWithWalletRequest } from "@sharemyride/shared";

export async function payWithWalletRequest(
  data: PayBookingWithWalletRequest,
): Promise<void> {
  const response = await apiClientFetch<null>(
    "/api/v1/payments/booking/wallet",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (response && response.success) {
    return;
  }

  throw new Error(response?.message || "Failed to process wallet payment");
}
