import { apiClientFetch } from "@/lib/api-client";
import { GetDriverDetailsResult } from "@sharemyride/shared";

export async function getAdminDriverDetailsRequest(
  driverId: string,
): Promise<GetDriverDetailsResult | null> {
  const url = `/api/v1/admin/trip/driver/details/${driverId}`;
  const response = await apiClientFetch<GetDriverDetailsResult | null>(url);
  if (response && response.success && response.payload) {
    return response.payload;
  }
  return null;
}
