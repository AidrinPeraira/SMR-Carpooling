import { apiClientFetch } from "@/lib/api-client";
import { GetPayoutsResult } from "@sharemyride/shared";

export async function getAllPayoutsRequest(
  params?: Record<string, string>,
  searchFields?: string[],
) {
  let url = "/api/v1/payouts/admin";
  if (params || searchFields) {
    const urlParams = new URLSearchParams(params);
    if (searchFields) {
      for (const field of searchFields) {
        urlParams.append("searchFields", field);
      }
    }
    const searchString = urlParams.toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<GetPayoutsResult>(url);
}
