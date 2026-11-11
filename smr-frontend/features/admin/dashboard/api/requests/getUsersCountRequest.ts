import { apiClientFetch } from "@/lib/api-client";
import { GetUsersCountResult } from "@sharemyride/shared";

export async function getUsersCountRequest(): Promise<GetUsersCountResult> {
  const response = await apiClientFetch<GetUsersCountResult>(
    "/api/v1/admin/users/dashboard/count",
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch users count");
  }

  return response.payload;
}
