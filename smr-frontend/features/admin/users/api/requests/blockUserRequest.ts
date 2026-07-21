import { apiClientFetch } from "@/lib/api-client";

export async function blockUserRequest(userId: string) {
  return await apiClientFetch<void>(`/api/v1/admin/users/block/${userId}`, {
    method: "PATCH",
  });
}
