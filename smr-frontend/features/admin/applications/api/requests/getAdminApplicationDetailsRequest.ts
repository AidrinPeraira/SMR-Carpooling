import { apiClientFetch } from "@/lib/api-client";
import { ApplicationDetailsResult } from "@sharemyride/shared";

export async function getAdminApplicationDetailsRequest(
  applicationId: string,
) {
  const url = `/api/v1/admin/applications/${applicationId}`;
  return await apiClientFetch<ApplicationDetailsResult>(url);
}
