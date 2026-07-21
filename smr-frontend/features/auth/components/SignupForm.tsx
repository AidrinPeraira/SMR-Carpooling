"use client";

import { GoogleLogin } from "@/features/auth/components/GoogleLogin";
import { Button, cn, Input, Label, Loader, useToast } from "@sharemyride/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SignUpRequest, SignUpUserSchema } from "@sharemyride/shared";
import { signupUserAction } from "@/features/auth/api/actions/SignupUserAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { logger } from "@/lib/logger";

interface Props {
  className?: string;
}

export function SignupForm({ className }: Props) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequest>({
    resolver: zodResolver(SignUpUserSchema),
  });

  function onSubmit(data: SignUpRequest) {
    startTransition(async () => {
      try {
        const result = await signupUserAction(data);
        logger.info("Handllel signup result: ", result);
        if (result.success) {
          toast(result.message || "User signup success!", {
            variant: "success",
            description: result.description + " Verify your email to continue.",
          });
        } else {
          toast(result.errorMessage || "User signup failed!", {
            variant: "error",
            description: result.description,
          });
        }
      } catch (error: unknown) {
        logger.error("Error handling signup form submit: ", error);
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
          Create an account
        </h1>
        <p className="text-fg-secondary mt-1">
          Start your journey with us today
        </p>
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 relative group">
            <Label>First Name</Label>
            <Input placeholder="John" {...register("first_name")} />
            {errors.first_name && (
              <>
                <p className="text-xs font-semibold pl-1 text-fg-danger">
                  Invalid Entry
                </p>
                <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                  {errors.first_name.message ||
                    "Name must be at least 2 characters."}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1 relative group">
            <Label>Last Name</Label>
            <Input placeholder="Doe" {...register("last_name")} />

            {errors.last_name && (
              <>
                <p className="text-xs font-semibold pl-1 text-fg-danger">
                  Invalid Entry
                </p>
                <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                  {errors.last_name.message ||
                    "Name must be at least 2 characters."}
                </p>
              </>
            )}
          </div>
        </div>
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
                {errors.email_id.message ||
                  `Email ID must be atleast 5 characters with atleast 1 "@" symbol.`}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 relative group">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="9876543210"
            formNoValidate
            {...register("phone_number")}
          />
          {errors.phone_number && (
            <>
              <p className="text-xs font-semibold pl-1 text-fg-danger">
                Invalid Entry
              </p>

              <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                {errors.phone_number.message ||
                  "Must be valid indian 10 digit mobile phone number without prefix"}
              </p>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 relative group">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <>
                <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 bottom-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                  {errors.password.message ||
                    "The password must be 8 Characters with atleast 1 number, 1 uppercase and 1 special character"}
                </p>
                <p className="text-xs font-semibold pl-1 text-fg-danger">
                  Invalid Entry
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1 relative group">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <>
                <p className="text-xs font-semibold pl-1 text-fg-danger">
                  Invalid Entry
                </p>

                <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 bottom-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                  {errors.confirm_password.message ||
                    "This field must be the same as password."}
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          className="mt-2 w-full flex items-center justify-center gap-2"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader className="w-4 h-4" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
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
