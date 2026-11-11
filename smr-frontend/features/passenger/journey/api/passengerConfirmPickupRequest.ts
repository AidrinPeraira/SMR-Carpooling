import { apiClientFetch } from "@/lib/api-client";
import { PassengerConfirmPickupRequest } from "@sharemyride/shared";

export async function passengerConfirmPickupRequest(
  body: PassengerConfirmPickupRequest,
): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/journey/passenger/confirm-pickup`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to confirm pickup");
  }
}
