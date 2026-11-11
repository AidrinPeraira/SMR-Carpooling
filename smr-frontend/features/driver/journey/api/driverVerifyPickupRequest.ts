import { apiClientFetch } from "@/lib/api-client";
import { DriverVerifyPickupRequest } from "@sharemyride/shared";

export async function driverVerifyPickupRequest(
  body: DriverVerifyPickupRequest,
): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/journey/driver/verify-pickup`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to verify pickup OTP");
  }
}
