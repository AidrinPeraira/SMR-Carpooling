import { apiClientFetch } from "@/lib/api-client";
import { ApplicationResult, PaginatedPayload } from "@sharemyride/shared";

export async function getUserApplicationsRequest(
  params?: Record<string, string>,
) {
  let url = "/api/v1/applications";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<ApplicationResult[]> | ApplicationResult[]>(url);
}
