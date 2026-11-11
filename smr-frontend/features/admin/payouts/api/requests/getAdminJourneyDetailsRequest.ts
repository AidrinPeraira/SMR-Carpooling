import { apiClientFetch } from "@/lib/api-client";
import { AdminJourneyDetailsResult } from "@sharemyride/shared";

export async function getAdminJourneyDetailsRequest(journeyId: string) {
  const url = `/api/v1/admin/trip/trips/journey/${journeyId}`;
  return await apiClientFetch<AdminJourneyDetailsResult>(url);
}
