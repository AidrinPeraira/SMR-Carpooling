import { apiClientFetch } from "@/lib/api-client";
import {
  PricingRuleResponseAPI,
  UpdatePricingRequestAPI,
} from "@sharemyride/shared";

export async function updatePricingRuleRequest(
  id: string,
  data: UpdatePricingRequestAPI,
) {
  return await apiClientFetch<PricingRuleResponseAPI>(
    `/api/v1/admin/trip/config/pricing/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}
