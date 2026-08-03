"use client";

import { Modal } from "@sharemyride/ui";
import { OnboardingApplicationView } from "@/features/application";

export default function OnboardingApplicationModalPage() {
  return (
    <Modal className="max-w-2xl">
      <OnboardingApplicationView />
    </Modal>
  );
}
