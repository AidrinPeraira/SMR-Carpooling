import { apiClientFetch } from "@/lib/api-client";
import { GetTripsCountResult } from "@sharemyride/shared";

export async function getTripsCountRequest(): Promise<GetTripsCountResult> {
  const response = await apiClientFetch<GetTripsCountResult>(
    "/api/v1/admin/trip/trips/dashboard/count",
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch trips count");
  }

  return response.payload;
}
