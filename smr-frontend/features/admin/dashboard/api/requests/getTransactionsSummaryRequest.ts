import { apiClientFetch } from "@/lib/api-client";
import { GetTransactionsSummaryResult } from "@sharemyride/shared";

export async function getTransactionsSummaryRequest(): Promise<GetTransactionsSummaryResult> {
  const response = await apiClientFetch<GetTransactionsSummaryResult>(
    "/api/v1/admin/dashboard/summary",
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch transactions summary");
  }

  return response.payload;
}
