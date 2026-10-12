import { Tag } from "@sharemyride/ui";
import { JourneyStatus, PassengerJourneyStatus } from "@sharemyride/shared";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface JourneyStatusHeaderProps {
  journeyId: string;
  journeyStatus: JourneyStatus;
  passengerStatus: PassengerJourneyStatus;
}

function getPassengerStatusTag(status: PassengerJourneyStatus) {
  switch (status) {
    case PassengerJourneyStatus.PICKED_UP:
      return (
        <Tag
          variant="accent"
          className="bg-success-surface text-success-content border-success-border"
        >
          ONBOARD
        </Tag>
      );
    case PassengerJourneyStatus.NOT_BOARDED:
      return (
        <Tag
          variant="muted"
          className="bg-warning-surface text-warning-content border-warning-border"
        >
          AWAITING PICKUP
        </Tag>
      );
    case PassengerJourneyStatus.DROPPED_OFF:
      return (
        <Tag
          variant="accent"
          className="bg-success-surface text-success-content border-success-border"
        >
          DROPPED OFF
        </Tag>
      );
    case PassengerJourneyStatus.ENDED:
      return <Tag variant="muted">ENDED</Tag>;
    case PassengerJourneyStatus.NO_SHOW:
      return (
        <Tag
          variant="muted"
          className="bg-error-surface text-error-content border-error-border"
        >
          NO SHOW
        </Tag>
      );
    default: {
      const _exhaustive: never = status;
      return <Tag variant="muted">{String(_exhaustive)}</Tag>;
    }
  }
}

export function JourneyStatusHeader({
  journeyId,
  journeyStatus,
  passengerStatus,
}: JourneyStatusHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/passenger/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
            Live Journey
          </p>
          <h1 className="text-2xl font-bold text-content-primary mt-1 flex items-center gap-2">
            On the way
            {journeyStatus === JourneyStatus.ONGOING && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent text-accent-fg">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-fg mr-1 animate-pulse" />
                LIVE
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-content-secondary">
            Journey #{journeyId.slice(0, 8)}
          </span>
          {getPassengerStatusTag(passengerStatus)}
        </div>
      </div>
    </div>
  );
}
