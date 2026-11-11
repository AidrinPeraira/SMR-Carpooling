import { apiClientFetch } from "@/lib/api-client";
import { GetRevenueTrendResult, TrendRange } from "@sharemyride/shared";

export async function getRevenueTrendRequest(
  range: TrendRange = TrendRange.LAST_MONTH,
): Promise<GetRevenueTrendResult> {
  const response = await apiClientFetch<GetRevenueTrendResult>(
    `/api/v1/admin/dashboard/revenue-trend?range=${range}`,
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch revenue trend");
  }

  return response.payload;
}
