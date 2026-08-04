"use client";

import { Modal } from "@sharemyride/ui";
import { DriverRenewalView } from "@/features/application";

export default function RenewDriverApplicationModalPage() {
  return (
    <Modal className="max-w-2xl">
      <DriverRenewalView />
    </Modal>
  );
}
