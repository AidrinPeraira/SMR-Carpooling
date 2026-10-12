import { apiClientFetch } from "@/lib/api-client";
import { DriverArrivedRequest } from "@sharemyride/shared";

export async function driverArrivedRequest(
  body: DriverArrivedRequest,
): Promise<void> {
  const response = await apiClientFetch<null>(`/api/v1/journey/driver/arrived`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to record arrival");
  }
}
