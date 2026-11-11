import { apiClientFetch } from "@/lib/api-client";
import { GetJourneyDetailsResult } from "@sharemyride/shared";

export type GetJourneyDetailsResponse = GetJourneyDetailsResult;

export async function getJourneyDetailsRequest(
  tripId: string,
): Promise<GetJourneyDetailsResult> {
  const response = await apiClientFetch<GetJourneyDetailsResult>(
    "/api/v1/trips/journey-details",
    {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId }),
    },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to get journey details");
  }

  return response.payload;
}
