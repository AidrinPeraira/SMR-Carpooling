import { apiClientFetch } from "@/lib/api-client";

export async function unBlockUserRequest(userId: string) {
  return await apiClientFetch<void>(`/api/v1/admin/users/unblock/${userId}`, {
    method: "PATCH",
  });
}
