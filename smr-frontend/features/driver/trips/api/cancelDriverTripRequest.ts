import { apiClientFetch } from "@/lib/api-client";

export async function cancelDriverTripRequest(tripId: string): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/trips/driver/${tripId}/cancel`,
    {
      method: "PATCH",
    },
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to cancel trip");
  }
}
