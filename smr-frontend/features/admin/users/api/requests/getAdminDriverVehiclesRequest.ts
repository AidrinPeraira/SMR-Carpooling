import { apiClientFetch } from "@/lib/api-client";
import { GetDriverVehiclesResult } from "@sharemyride/shared";

export async function getAdminDriverVehiclesRequest(
  driverId: string,
): Promise<GetDriverVehiclesResult[]> {
  const url = `/api/v1/admin/trip/vehicles/${driverId}`;
  const response = await apiClientFetch<GetDriverVehiclesResult[]>(url);
  if (response && response.success && Array.isArray(response.payload)) {
    return response.payload;
  }
  return [];
}
