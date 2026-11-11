import { apiClientFetch } from "@/lib/api-client";
import { GetWalletTransactionsResult } from "@sharemyride/shared";

export async function getWalletTransactionsRequest(
  params?: Record<string, string>,
) {
  let url = "/api/v1/wallet/transactions";
  if (params) {
    const searchString = new URLSearchParams(params).toString();
    if (searchString) {
      url += `?${searchString}`;
    }
  }
  return await apiClientFetch<GetWalletTransactionsResult>(url);
}
