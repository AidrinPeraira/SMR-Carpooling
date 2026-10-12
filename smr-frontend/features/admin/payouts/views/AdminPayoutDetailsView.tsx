"use client";

import { PayoutInfoCard } from "@/features/admin/payouts/components/payout-details/PayoutInfoCard";
import { JourneyInfoCard } from "@/features/admin/payouts/components/payout-details/JourneyInfoCard";
import { getPayoutDetailsRequest } from "@/features/admin/payouts/api/requests/getPayoutDetailsRequest";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export function AdminPayoutDetailsView() {
  const params = useParams();
  const payoutId = (params?.payoutId as string) || "";

  const { data } = useQuery({
    queryKey: ["payoutDetails", payoutId],
    queryFn: async () => getPayoutDetailsRequest(payoutId),
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
  });

  const tripId =
    data?.success && data.payload ? data.payload.payout.trip_id : undefined;

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <PayoutInfoCard payoutId={payoutId} />
      {tripId && <JourneyInfoCard journeyId={tripId} />}
    </div>
  );
}
