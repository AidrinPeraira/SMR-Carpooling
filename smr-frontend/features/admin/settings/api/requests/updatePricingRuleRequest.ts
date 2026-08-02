import { apiClientFetch } from "@/lib/api-client";
import {
  PricingRuleResult,
  UpdatePricingRequest,
} from "@sharemyride/shared";

export async function updatePricingRuleRequest(
  id: string,
  data: UpdatePricingRequest,
) {
  return await apiClientFetch<PricingRuleResult>(
    `/api/v1/admin/trip/config/pricing/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}
