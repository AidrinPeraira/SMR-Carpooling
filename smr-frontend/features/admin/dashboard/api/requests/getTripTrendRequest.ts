import { apiClientFetch } from "@/lib/api-client";
import { GetTripTrendResult, TrendRange } from "@sharemyride/shared";

export async function getTripTrendRequest(
  range: TrendRange = TrendRange.LAST_MONTH,
): Promise<GetTripTrendResult> {
  const response = await apiClientFetch<GetTripTrendResult>(
    `/api/v1/admin/trip/trips/dashboard/trend?range=${range}`,
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch trip trend");
  }

  return response.payload;
}
