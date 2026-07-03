import PassengerNavBar from "@/features/passenger/components/PassengerNavBar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DriverLayout({ children }: Props) {
  return (
    <div>
      <PassengerNavBar />
      {children}
    </div>
  );
}
