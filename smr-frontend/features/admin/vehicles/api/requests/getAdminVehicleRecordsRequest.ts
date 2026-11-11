import { apiClientFetch } from "@/lib/api-client";
import { AdminVehicleRecordResult, PaginatedPayload } from "@sharemyride/shared";

export async function getAdminVehicleRecordsRequest(
  params?: Record<string, string>,
) {
  let url = "/api/v1/admin/vehicles";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<AdminVehicleRecordResult[]>>(
    url,
  );
}
