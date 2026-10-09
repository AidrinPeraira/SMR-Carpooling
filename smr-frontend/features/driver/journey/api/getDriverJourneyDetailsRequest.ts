import { apiClientFetch } from "@/lib/api-client";
import { GetDriverJourneyDetailsResult } from "@sharemyride/shared";

export async function getDriverJourneyDetailsRequest(
  journeyId: string,
): Promise<GetDriverJourneyDetailsResult> {
  const response = await apiClientFetch<GetDriverJourneyDetailsResult>(
    `/api/v1/journey/${journeyId}/driver`,
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(response.message || "Failed to fetch driver journey details");
}
