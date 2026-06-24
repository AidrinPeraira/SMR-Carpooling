"use client";

import { GoogleLogin } from "@/features/auth/components/GoogleLogin";
import { Button, cn, Input, Label, Loader, useToast } from "@smr/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginRequest, LoginUserSchema } from "@smr/shared";
import { loginUserAction } from "@/features/auth/api/actions/LoginUserAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
}

export function LoginForm({ className }: Props) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginUserSchema),
  });

  function onSubmit(data: LoginRequest) {
    startTransition(async () => {
      try {
        const result = await loginUserAction(data);
        logger.info("Handle login result: ", result);
        if (result.success) {
          toast(result.message || "User login success!", {
            variant: "success",
            description: result.description,
          });
          const role = result.payload?.user.user_role.toLowerCase();
          router.push(`/${role ? role : ""}`);
        } else {
          toast(result.errorMessage || "User login failed!", {
            variant: "error",
            description: result.description,
          });
        }
      } catch (error: unknown) {
        logger.error("Error handling login form submit: ", error);
        toast("Something went wrong.", {
          variant: "error",
          description: "Please try again later",
        });
      }
    });
  }

  return (
    <div
      className={cn(
        className,
        "rounded px-4 py-6 mx-3 max-h-screen lg:max-w-sm my-auto",
      )}
    >
      <div className="mb-5">
        <h1 className="text-fg-primary text-3xl font-bold">
          Login to existing account.
        </h1>
        <p className="text-fg-secondary mt-1">Get back to sharing rides</p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1 relative group">
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="johndoe@email.com"
            formNoValidate
            {...register("email_id")}
          />
          {errors.email_id && (
            <>
              <p className="text-xs font-semibold pl-1 text-fg-danger">
                Invalid Entry
              </p>
              <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                {errors.email_id.message || "Invalid email format."}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 relative group">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <>
              <p className="text-xs font-semibold pl-1 text-fg-danger">
                Invalid Entry
              </p>
              <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 bottom-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                {errors.password.message || "Password is required."}
              </p>
            </>
          )}
        </div>

        <Button
          className="mt-2 w-full flex items-center justify-center gap-2"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader className="w-4 h-4" />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <div className="relative my-5">
        <div className="relative flex justify-center text-xs ">
          <span className="bg-bg-primary px-2 text-fg-secondary">
            Or login via Google{" "}
          </span>
        </div>
      </div>

      <GoogleLogin className="w-full" />

      <p className="mt-5 text-center text-sm text-fg-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
