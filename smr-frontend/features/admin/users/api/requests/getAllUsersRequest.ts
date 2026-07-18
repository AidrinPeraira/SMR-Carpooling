import { apiClientFetch } from "@/lib/api-client";
import { GetAllUsersResult, PaginatedPayload } from "@smr/shared";

export async function getAllUsersRequest(params?: Record<string, string>) {
  let url = "/api/v1/admin/users";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<GetAllUsersResult[]>>(url);
}
