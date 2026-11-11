import { apiClientFetch } from "@/lib/api-client";
import { DriverDropOffPassengerRequest } from "@sharemyride/shared";

export async function driverDropOffPassengerRequest(
  body: DriverDropOffPassengerRequest,
): Promise<void> {
  const response = await apiClientFetch<null>(`/api/v1/journey/driver/drop-off`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to confirm drop-off");
  }
}
