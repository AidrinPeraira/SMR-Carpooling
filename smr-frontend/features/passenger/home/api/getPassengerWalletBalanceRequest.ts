import { apiClientFetch } from "@/lib/api-client";
import { GetWalletTransactionsResult } from "@sharemyride/shared";

export async function getPassengerWalletBalanceRequest(): Promise<GetWalletTransactionsResult> {
  const response = await apiClientFetch<GetWalletTransactionsResult>(
    "/api/v1/wallet/transactions?page=1&limit=1",
    { method: "GET" },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch wallet balance");
  }

  return response.payload;
}
