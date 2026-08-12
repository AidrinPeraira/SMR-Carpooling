"use client";

import { Card, Button } from "@sharemyride/ui";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function OfferTripCard() {
  const router = useRouter();

  return (
    <Card className="p-5 flex flex-col gap-4 shadow-xs">
      <div>
        <h2 className="text-lg font-semibold text-content-primary">
          Offer a Ride
        </h2>
        <p className="text-xs text-content-secondary mt-1">
          Plan a new trip and help reduce emissions.
        </p>
      </div>

      <Button
        variant="primary"
        onClick={() => router.push("/driver/trips/new-trip")}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Create Trip</span>
      </Button>
    </Card>
  );
}
