import { Avatar, Tag } from "@sharemyride/ui";

interface PassengerCardProps {
  initials: string;
  name: string;
  route: string;
  status: "pickup-pending" | "onboard";
  statusDetail?: string;
  fare?: string;
}

export function PassengerCard({
  initials,
  name,
  route,
  status,
  statusDetail,
  fare,
}: PassengerCardProps) {
  return (
    <div className="bg-surface-card rounded-xl p-3.5 border border-border-subtle shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} size="sm" />
          <div>
            <h4 className="text-sm font-bold text-content-primary">{name}</h4>
            <p className="text-[10px] text-content-secondary tracking-wide">
              {route}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {status === "pickup-pending" ? (
            <span className="px-2 py-0.5 rounded bg-warning-surface text-warning-content text-[10px] font-semibold border border-warning-border">
              {statusDetail ?? "Pickup pending"}
            </span>
          ) : (
            <Tag variant="accent">Onboard</Tag>
          )}
          {fare && (
            <span className="text-[10px] font-semibold text-content-secondary">
              {fare}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
