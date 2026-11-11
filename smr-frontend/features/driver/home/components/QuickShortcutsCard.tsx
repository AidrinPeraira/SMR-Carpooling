import { Card } from "@sharemyride/ui";
import { UserPlus, Wallet, ChevronRight } from "lucide-react";
import Link from "next/link";

const shortcuts = [
  {
    icon: UserPlus,
    title: "Manage Requests",
    subtitle: "Pending ride approvals",
    color: "text-accent bg-accent/10",
    navPath: "/driver/bookings",
  },
  {
    icon: Wallet,
    title: "Payouts & Wallet",
    subtitle: "Weekly auto-transfer",
    color: "text-accent bg-accent/10",
    navPath: "/profile/wallet",
  },
];

export function QuickShortcutsCard() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-content-primary mb-4">
        Quick Shortcuts
      </h3>
      <div className="space-y-2">
        {shortcuts.map((s) => (
          <Link
            key={s.title}
            href={s.navPath}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-muted transition-colors border border-border-strong group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${s.color}`}
              >
                <s.icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <span className="font-semibold text-sm text-content-primary block">
                  {s.title}
                </span>
                <span className="text-xs text-content-secondary">
                  {s.subtitle}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-content-tertiary group-hover:text-accent transition-colors" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
