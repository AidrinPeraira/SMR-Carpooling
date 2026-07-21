import { VerifySignupEmailCard } from "@/features/auth/components/VerifySignupEmailCard";
import { Suspense } from "react";

export function VerifySignupEmailView() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <VerifySignupEmailCard />
      </Suspense>
    </div>
  );
}
