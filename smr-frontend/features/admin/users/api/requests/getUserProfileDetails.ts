import { apiClientFetch } from "@/lib/api-client";
import { GetFullUserProfileResult } from "@sharemyride/shared";

export async function getUserProfileDetails(id: string) {
  const url = `/api/v1/admin/users/${id}`;
  return await apiClientFetch<GetFullUserProfileResult>(url);
}
