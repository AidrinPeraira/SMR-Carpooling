import PortalNavbar from "@/components/PortalNavbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PassengerLayout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-base">
      <PortalNavbar userRole="passenger" />
      <main 
        className="flex-1 min-w-0 overflow-y-auto bg-surface-base"
        style={{ boxShadow: "inset 4px 4px 8px -2px rgba(0, 0, 0, 0.06)" }}
      >
        {children}
      </main>
    </div>
  );
}
