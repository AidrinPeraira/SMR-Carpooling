import { apiClientFetch } from "@/lib/api-client";
import { AdminTransactionItemDTO, PaginatedPayload } from "@sharemyride/shared";

export async function getTransactionsRequest(params?: Record<string, string>) {
  let url = "/api/v1/admin/transactions";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<PaginatedPayload<AdminTransactionItemDTO[]>>(url);
}
