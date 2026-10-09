import { Card, Button, Avatar } from "@sharemyride/ui";
import { Clock, MapPin, Phone, MessageSquare, CheckCircle } from "lucide-react";

export function CurrentTargetCard() {
  return (
    <Card className="p-4 border-2 border-accent relative overflow-visible">
      <div className="absolute top-0 right-0 bg-accent text-accent-fg text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
        Current Target
      </div>

      <div>
        <span className="text-[10px] font-bold text-accent tracking-wider uppercase">
          Next Stop: Mathikere Drop (#5)
        </span>
        <h2 className="text-base font-bold text-content-primary mt-0.5">
          8 min away &middot; 2.4 km
        </h2>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-content-secondary">
          <Clock className="w-3.5 h-3.5" />
          <span>ETA 10:32 AM</span>
          <MapPin className="w-3.5 h-3.5 ml-1" />
          <span>Drop-off point</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar initials="RS" size="sm" />
          <div>
            <p className="text-sm font-bold text-content-primary">Rahul S</p>
            <p className="text-[10px] text-content-secondary font-medium">
              Seat 1 &middot; 1 Bag
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-secondary flex items-center justify-center text-content-primary transition-colors"
            title="Call Rahul"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-secondary flex items-center justify-center text-content-primary transition-colors"
            title="Chat with Rahul"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Button
        variant="primary"
        className="mt-4 w-full py-2.5 rounded-full flex items-center justify-center gap-2 font-bold"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Arrived at Drop-off</span>
      </Button>
    </Card>
  );
}
