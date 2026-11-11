"use client";

import { Modal } from "@sharemyride/ui";
import { NewVehicleApplicationView } from "@/features/application";

export default function AddVehicleApplicationModalPage() {
  return (
    <Modal className="max-w-2xl">
      <NewVehicleApplicationView />
    </Modal>
  );
}
