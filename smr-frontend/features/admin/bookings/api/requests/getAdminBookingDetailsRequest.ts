import { apiClientFetch } from "@/lib/api-client";
import { AdminBookingDetailsDTO } from "@sharemyride/shared";

export async function getAdminBookingDetailsRequest(bookingId: string) {
  const url = `/api/v1/admin/trip/bookings/details/${bookingId}`;
  return await apiClientFetch<AdminBookingDetailsDTO>(url);
}
