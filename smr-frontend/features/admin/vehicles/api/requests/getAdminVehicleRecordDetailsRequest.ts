import { apiClientFetch } from "@/lib/api-client";
import { AdminVehicleRecordDetailsResult } from "@sharemyride/shared";

export async function getAdminVehicleRecordDetailsRequest(
  recordId: string,
): Promise<AdminVehicleRecordDetailsResult | null> {
  const url = `/api/v1/admin/vehicles/${recordId}`;
  const response =
    await apiClientFetch<AdminVehicleRecordDetailsResult>(url);
  if (response && response.success && response.payload) {
    return response.payload;
  }
  return null;
}
