import { apiClientFetch } from "@/lib/api-client";
import { GetDriverOverviewResult } from "@sharemyride/shared";

export async function getDriverOverviewRequest(): Promise<GetDriverOverviewResult> {
  const response = await apiClientFetch<GetDriverOverviewResult>(
    `/api/v1/driver/overview`,
    {
      method: "GET",
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(
    response.message || "Failed to fetch driver overview details",
  );
}
