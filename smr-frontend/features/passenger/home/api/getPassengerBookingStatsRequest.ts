import { apiClientFetch } from "@/lib/api-client";
import { PassengerBookingStatsResult } from "@sharemyride/shared";

export async function getPassengerBookingStatsRequest(): Promise<PassengerBookingStatsResult> {
  const response = await apiClientFetch<PassengerBookingStatsResult>(
    "/api/v1/bookings/passenger/stats",
    { method: "GET" },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch booking stats");
  }

  return response.payload;
}
