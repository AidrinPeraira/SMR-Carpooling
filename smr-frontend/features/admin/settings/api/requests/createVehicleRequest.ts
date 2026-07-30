import { apiClientFetch } from "@/lib/api-client";
import {
  CreateVehicleRequestAPI,
  VehicleListResponseAPI,
} from "@sharemyride/shared";

export async function createVehicleRequest(data: CreateVehicleRequestAPI) {
  return await apiClientFetch<VehicleListResponseAPI>(
    "/api/v1/admin/trip/config/vehicles",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
