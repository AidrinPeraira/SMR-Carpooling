import { Tag } from "@sharemyride/ui";
import { Clock, Route, Users } from "lucide-react";

export function NavigationDrawerHeader() {
  return (
    <div className="p-4 border-b border-border-subtle bg-surface-base shrink-0">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-accent leading-none">
            22 min
          </span>
          <span className="text-base font-semibold text-content-secondary">
            9.8 km
          </span>
        </div>
        <Tag variant="accent">On Route</Tag>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-content-secondary">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>ETA 10:58 AM</span>
        </div>
        <div className="flex items-center gap-1">
          <Route className="w-3.5 h-3.5" />
          <span>Normal traffic</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>3/4 Seats</span>
        </div>
      </div>
    </div>
  );
}
