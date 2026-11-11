"use client";

import { Modal } from "@sharemyride/ui";
import { VehicleRenewalView } from "@/features/application";

export default function RenewVehicleApplicationModalPage() {
  return (
    <Modal className="max-w-2xl">
      <VehicleRenewalView />
    </Modal>
  );
}
