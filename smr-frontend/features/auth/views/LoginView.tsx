import { AuthHero } from "@/features/auth/components/AuthHero";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function LoginView() {
  return (
    <div className="flex relative h-screen w-full bg-primary overflow-hidden">
      <AuthHero className="hidden md:block 2 h-full" />
      <LoginForm className="w-full max-w-lg rounded" />
    </div>
  );
}
