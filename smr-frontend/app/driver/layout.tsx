import PortalNavbar from "@/components/PortalNavbar";
import { ReactNode } from "react";
import { VoiceCallProvider } from "@/features/voice-call/context/VoiceCallContext";
import { CallModals } from "@/features/voice-call/components/CallModals";

interface Props {
  children: ReactNode;
}

export default function DriverLayout({ children }: Props) {
  return (
    <VoiceCallProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-base">
        <PortalNavbar userRole="driver" />
        <main 
          className="flex-1 min-w-0 overflow-y-auto bg-surface-base"
          style={{ boxShadow: "inset 4px 4px 8px -2px rgba(0, 0, 0, 0.06)" }}
        >
          {children}
        </main>
      </div>
      <CallModals />
    </VoiceCallProvider>
  );
}
