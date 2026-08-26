import { WalletTransactionsView } from "@/features/profile/views/WalletTransactionsView";

export default function WalletPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-content-primary">
        Wallet & Transactions
      </h1>
      <WalletTransactionsView />
    </div>
  );
}
