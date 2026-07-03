import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DriverLayout({ children }: Props) {
  return (
    <div>
      <div>Nav Bar</div>
      {children}
    </div>
  );
}
