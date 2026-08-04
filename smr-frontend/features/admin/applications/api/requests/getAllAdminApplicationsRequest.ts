import { apiClientFetch } from "@/lib/api-client";
import { AdminApplicationListResult, PaginatedPayload } from "@sharemyride/shared";

export async function getAllAdminApplicationsRequest(
  params?: Record<string, string>,
) {
  let url = "/api/v1/admin/applications";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<AdminApplicationListResult[]>>(url);
}
