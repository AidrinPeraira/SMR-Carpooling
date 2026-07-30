import { apiClientFetch } from "@/lib/api-client";
import {
  CreatePricingRequestAPI,
  PricingRuleResponseAPI,
} from "@sharemyride/shared";

export async function createPricingRuleRequest(
  data: CreatePricingRequestAPI,
) {
  return await apiClientFetch<PricingRuleResponseAPI>(
    "/api/v1/admin/trip/config/pricing",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
