import { apiClientFetch } from "@/lib/api-client";
import { GetConfigurationsResponseAPI } from "@sharemyride/shared";

export async function getConfigurationsRequest() {
  return await apiClientFetch<GetConfigurationsResponseAPI>(
    "/api/v1/admin/trip/config",
  );
}
