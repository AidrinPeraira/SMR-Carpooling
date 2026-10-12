import { Card } from "@sharemyride/ui";
import { Wallet } from "lucide-react";
import { CustomerEarningsResult } from "@sharemyride/shared";

interface Props {
  earnings: CustomerEarningsResult;
}

export function TotalEarningsCard({ earnings }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Total Earnings
        </span>
        <span className="text-2xl font-bold text-content-primary">
          ₹{earnings.total_earnings.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Wallet className="w-6 h-6" />
      </div>
    </Card>
  );
}
