import { GoogleLogin } from "@/features/auth/components/GoogleLogin";
import { Button, cn, Input, Label } from "@smr/ui";
import Link from "next/link";

interface Props {
  className?: string;
}

export function SignupForm({ className }: Props) {
  return (
    <div
      className={cn(
        className,
        "rounded px-4 py-6 mx-3 max-h-screen lg:max-w-sm my-auto",
      )}
    >
      <div className="mb-5">
        <h1 className="text-fg-primary text-3xl font-bold">
          Create an account
        </h1>
        <p className="text-fg-secondary mt-1">
          Start your journey with us today
        </p>
      </div>

      <form className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label>First Name</Label>
            <Input placeholder="John" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Last Name</Label>
            <Input placeholder="Doe" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Email Address</Label>
          <Input type="email" placeholder="johndoe@email.com" />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="9876543210" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
        </div>

        <Button className="mt-2 w-full">
          Create Account
        </Button>
      </form>
      <div className="relative my-5">
        <div className="relative flex justify-center text-xs ">
          <span className="bg-bg-primary px-2 text-fg-secondary">
            Or signup via Google{" "}
          </span>
        </div>
      </div>

      <GoogleLogin className="w-full" />

      <p className="mt-5 text-center text-sm text-fg-secondary">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
