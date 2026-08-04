import { apiClientFetch } from "@/lib/api-client";
import {
  UpdateVehicleRequest,
  VehicleListResult,
} from "@sharemyride/shared";

export async function updateVehicleRequest(
  id: string,
  data: UpdateVehicleRequest,
) {
  return await apiClientFetch<VehicleListResult>(
    `/api/v1/admin/trip/config/vehicles/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}
