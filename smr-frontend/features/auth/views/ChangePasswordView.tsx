import { ChangePasswordCard } from "@/features/auth/components/ChangePasswordCard";
import { Suspense } from "react";

export function ChangePasswordView() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <ChangePasswordCard />
      </Suspense>
    </div>
  );
}
