import { apiClientFetch } from "@/lib/api-client";
import { GetPayoutDetailsResult } from "@sharemyride/shared";

export async function getPayoutDetailsRequest(payoutId: string) {
  const url = `/api/v1/payouts/admin/${payoutId}`;
  return await apiClientFetch<GetPayoutDetailsResult>(url);
}
