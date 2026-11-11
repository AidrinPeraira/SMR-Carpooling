import { apiClientFetch } from "@/lib/api-client";

export async function startTripJourneyRequest(tripId: string): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/journey/${tripId}/start`,
    {
      method: "POST",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to start trip journey");
  }
}
