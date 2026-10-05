import { Card } from "@sharemyride/ui";
import { Wallet } from "lucide-react";

interface Props {
  totalEarnings: number;
  payoutStatus: string;
}

export function TotalEarningsCard({ totalEarnings, payoutStatus }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Earnings
        </span>
        <span className="text-2xl font-bold text-content-primary">
          ₹{totalEarnings.toLocaleString("en-IN")}
        </span>
        <span className="text-xs text-accent font-semibold flex items-center gap-0.5 mt-1">
          <Wallet className="w-3 h-3" />
          {payoutStatus}
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Wallet className="w-6 h-6" />
      </div>
    </Card>
  );
}
