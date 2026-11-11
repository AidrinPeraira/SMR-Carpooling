"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { getConfigurationsRequest } from "../api/requests/getConfigurationsRequest";
import { AdminTripPricingCard } from "../components/AdminTripPricingCard";
import { AdminVehicleListTable } from "../components/AdminVehicleListTable";

export function AdminConfigView() {
  const { isPending, error, data } = useQuery({
    queryKey: ["adminConfigurations"],
    queryFn: async () => {
      return await getConfigurationsRequest();
    },
    staleTime: process.env.NODE_ENV === "production" ? 60 * 1000 : 0,
  });

  if (isPending) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <InlineError message={`An error occurred: ${String(error)}`} />
    );
  }

  if (!data?.success || !data?.payload) {
    return (
      <InlineError
        message={data?.message || "Failed to load system settings configuration."}
      />
    );
  }

  const { pricing_rules = [], vehicles = [] } = data.payload;

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-content-primary">
          System Settings
        </h1>
        <p className="text-sm text-content-secondary mt-1">
          Configure platform-wide pricing rules and vehicle databases.
        </p>
      </div>

      <AdminTripPricingCard pricingRules={pricing_rules} />

      <AdminVehicleListTable vehicles={vehicles} />
    </div>
  );
}
