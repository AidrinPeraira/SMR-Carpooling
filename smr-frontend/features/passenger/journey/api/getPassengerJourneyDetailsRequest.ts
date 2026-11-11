import { apiClientFetch } from "@/lib/api-client";
import { GetPassengerJourneyDetailsResult } from "@sharemyride/shared";

export async function getPassengerJourneyDetailsRequest(
  journeyId: string,
): Promise<GetPassengerJourneyDetailsResult> {
  const response = await apiClientFetch<GetPassengerJourneyDetailsResult>(
    `/api/v1/journey/${journeyId}/passenger`,
    {
      method: "GET",
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(
    response.message || "Failed to fetch passenger journey details",
  );
}
