import { Card } from "@sharemyride/ui";
import { Wallet } from "lucide-react";

interface Props {
  balance: number;
}

export function WalletBalanceCard({ balance }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-content-secondary text-sm font-medium block mb-1">
          Wallet Balance
        </span>
        <span className="text-2xl font-bold text-content-primary">
          ₹{balance.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        <Wallet className="w-6 h-6" />
      </div>
    </Card>
  );
}
