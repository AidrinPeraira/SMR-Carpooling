import { apiClientFetch } from "@/lib/api-client";
import {
  CreateVehicleRequest,
  VehicleListResult,
} from "@sharemyride/shared";

export async function createVehicleRequest(data: CreateVehicleRequest) {
  return await apiClientFetch<VehicleListResult>(
    "/api/v1/admin/trip/config/vehicles",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
