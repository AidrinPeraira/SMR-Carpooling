import { apiClientFetch } from "@/lib/api-client";
import { GetConfigurationsResult } from "@sharemyride/shared";

export async function getAdminVehiclesRequest() {
  return await apiClientFetch<GetConfigurationsResult>(
    "/api/v1/admin/trip/config",
  );
}
