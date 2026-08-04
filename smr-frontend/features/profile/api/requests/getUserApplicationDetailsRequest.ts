import { apiClientFetch } from "@/lib/api-client";
import { ApplicationDetailsResult } from "@sharemyride/shared";

export async function getUserApplicationDetailsRequest(
  applicationId: string,
) {
  const url = `/api/v1/applications/${applicationId}`;
  return await apiClientFetch<ApplicationDetailsResult>(url);
}
