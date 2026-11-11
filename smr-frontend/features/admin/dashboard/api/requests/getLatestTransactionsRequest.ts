import { apiClientFetch } from "@/lib/api-client";
import {
  AdminTransactionItemDTO,
  PaginatedPayload,
} from "@sharemyride/shared";

export async function getLatestTransactionsRequest(): Promise<
  AdminTransactionItemDTO[]
> {
  const response = await apiClientFetch<
    PaginatedPayload<AdminTransactionItemDTO[]>
  >("/api/v1/admin/transactions?limit=5&sortField=createdAt&sortValue=dsc");

  if (!response.success || !response.payload) {
    throw new Error(
      response.message || "Failed to fetch latest transactions",
    );
  }

  return response.payload.data;
}
