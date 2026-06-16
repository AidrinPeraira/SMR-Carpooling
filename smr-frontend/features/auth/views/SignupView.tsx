import { AuthHero } from "@/features/auth/components/AuthHero";
import { SignupForm } from "@/features/auth/components/SignupForm";

export function SignupView() {
  return (
    <div className="flex relative h-screen w-full bg-primary overflow-hidden">
      <AuthHero className="hidden md:block 2 h-full" />
      <SignupForm className="w-full max-w-lg rounded" />
    </div>
  );
}
