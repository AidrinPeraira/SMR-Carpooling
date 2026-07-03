import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProfileLayout({ children }: Props) {
  return (
    <div>
      <h1>Profile Layout</h1>
      {children}
    </div>
  );
}
