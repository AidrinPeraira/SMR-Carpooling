import { apiClientFetch } from "@/lib/api-client";
import { GetConfigurationsResult } from "@sharemyride/shared";

export async function getAdminVehiclesRequest(params?: Record<string, string>) {
  let url = "/api/v1/admin/trip/config";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<GetConfigurationsResult>(url);
}
