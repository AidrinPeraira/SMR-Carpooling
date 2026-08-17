import { apiClientFetch } from "@/lib/api-client";
import { AdminBookingItemDTO, PaginatedPayload } from "@sharemyride/shared";

export async function getAllAdminBookingsRequest(
  params?: Record<string, string>,
) {
  let url = "/api/v1/admin/trip/bookings/all";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<AdminBookingItemDTO[]>>(url);
}
