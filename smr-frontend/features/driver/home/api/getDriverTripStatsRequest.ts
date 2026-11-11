import { apiClientFetch } from "@/lib/api-client";
import { DriverTripStatsResult } from "@sharemyride/shared";

export async function getDriverTripStatsRequest(): Promise<DriverTripStatsResult> {
  const response = await apiClientFetch<DriverTripStatsResult>(
    "/api/v1/driver/stats",
    { method: "GET" },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch driver trip stats");
  }

  return response.payload;
}
