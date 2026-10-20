import { apiClientFetch } from "@/lib/api-client";
import {
  AdminApplicationListResult,
  PaginatedPayload,
} from "@sharemyride/shared";

export async function getLatestApplicationsRequest(): Promise<
  AdminApplicationListResult[]
> {
  const response = await apiClientFetch<
    PaginatedPayload<AdminApplicationListResult[]>
  >("/api/v1/admin/applications?limit=5&sortField=createdAt&sortValue=dsc");

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch latest applications");
  }

  return response.payload.data;
}
