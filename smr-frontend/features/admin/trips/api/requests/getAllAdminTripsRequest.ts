import { apiClientFetch } from "@/lib/api-client";
import { AdminTripItemDTO, PaginatedPayload } from "@sharemyride/shared";

export async function getAllAdminTripsRequest(
  params?: Record<string, string>,
) {
  let url = "/api/v1/admin/trip/trips/all";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<AdminTripItemDTO[]>>(url);
}
