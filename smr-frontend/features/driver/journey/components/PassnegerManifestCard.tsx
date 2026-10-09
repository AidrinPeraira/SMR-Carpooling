import { PassengerCard } from "@/features/driver/journey/components/PassengerCard";

export function PassengerManifestCard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[10px] font-bold text-content-secondary tracking-wider uppercase">
          Passenger Manifest
        </h3>
        <span className="text-[10px] text-accent font-bold">
          3 Bookings Active
        </span>
      </div>
      <div className="space-y-2.5">
        <PassengerCard
          initials="P"
          name="Priya M."
          route="Sadashivanagar → Mathikere"
          status="pickup-pending"
          statusDetail="Pickup pending · 400m ahead"
        />
        <PassengerCard
          initials="RS"
          name="Rahul S."
          route="Jayanagar → Mathikere PO"
          status="onboard"
        />
        <PassengerCard
          initials="P2"
          name="Passenger 2"
          route="Koramangala → Yeshwantpur"
          status="onboard"
          fare="₹210.00 · Paid"
        />
      </div>
    </div>
  );
}
