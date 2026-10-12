import { apiClientFetch } from "@/lib/api-client";
import { CustomerEarningsResult } from "@sharemyride/shared";

export async function getDriverEarningsRequest(): Promise<CustomerEarningsResult> {
  const response = await apiClientFetch<CustomerEarningsResult>(
    "/api/v1/payments/earnings",
    { method: "GET" },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch driver earnings");
  }

  return response.payload;
}
