import { apiClientFetch } from "@/lib/api-client";

export async function approvePayoutRequest(payoutId: string) {
  return await apiClientFetch<void>(
    `/api/v1/payouts/admin/${payoutId}/approve`,
    {
      method: "PATCH",
    },
  );
}
