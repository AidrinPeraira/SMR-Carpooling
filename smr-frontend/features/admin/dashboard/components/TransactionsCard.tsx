"use client";

import { Card } from "@sharemyride/ui";
import { IndianRupee, CreditCard, ArrowUpRight, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsSummaryRequest } from "@/features/admin/dashboard/api/requests/getTransactionsSummaryRequest";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TransactionsCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminTransactionsSummary"],
    queryFn: getTransactionsSummaryRequest,
  });

  if (isLoading) {
    return <div className="h-28 bg-surface-muted rounded-lg animate-pulse" />;
  }

  if (!data) return null;

  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Revenue
        </span>
        <span className="text-2xl font-bold text-content-primary">
          {formatCurrency(data.total_revenue)}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-success-content font-semibold flex items-center gap-0.5">
            <CreditCard className="w-3 h-3" />
            {formatCurrency(data.booking_revenue)}
          </span>
          <span className="text-xs text-content-secondary font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            {formatCurrency(data.payouts_issued)}
          </span>
          <span className="text-xs text-error-content font-semibold flex items-center gap-0.5">
            <RotateCcw className="w-3 h-3" />
            {formatCurrency(data.refunds_issued)}
          </span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <IndianRupee className="w-6 h-6" />
      </div>
    </Card>
  );
}
