import { apiClientFetch } from "@/lib/api-client";
import {
  UpdateVehicleRequestAPI,
  VehicleListResponseAPI,
} from "@sharemyride/shared";

export async function updateVehicleRequest(
  id: string,
  data: UpdateVehicleRequestAPI,
) {
  return await apiClientFetch<VehicleListResponseAPI>(
    `/api/v1/admin/trip/config/vehicles/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}
