import { apiClientFetch } from "@/lib/api-client";
import { AdminTripDetailsDTO } from "@sharemyride/shared";

export async function getAdminTripDetailsRequest(tripId: string) {
  const url = `/api/v1/admin/trip/trips/details/${tripId}`;
  return await apiClientFetch<AdminTripDetailsDTO>(url);
}
