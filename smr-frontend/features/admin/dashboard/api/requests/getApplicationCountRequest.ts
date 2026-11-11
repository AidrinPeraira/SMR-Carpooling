import { apiClientFetch } from "@/lib/api-client";
import { GetApplicationCountResult } from "@sharemyride/shared";

export async function getApplicationCountRequest(): Promise<GetApplicationCountResult> {
  const response = await apiClientFetch<GetApplicationCountResult>(
    "/api/v1/admin/applications/dashboard/count",
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch application count");
  }

  return response.payload;
}
