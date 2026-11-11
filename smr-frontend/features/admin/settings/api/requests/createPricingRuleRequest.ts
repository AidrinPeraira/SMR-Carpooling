import { apiClientFetch } from "@/lib/api-client";
import {
  CreatePricingRequest,
  PricingRuleResult,
} from "@sharemyride/shared";

export async function createPricingRuleRequest(
  data: CreatePricingRequest,
) {
  return await apiClientFetch<PricingRuleResult>(
    "/api/v1/admin/trip/config/pricing",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
