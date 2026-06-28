"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Label,
  cn,
  useToast,
} from "@smr/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, ChangePasswordRequest } from "@smr/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { changePasswordAction } from "@/features/auth/api/actions/ChangePasswordAction";
import { logger } from "@/lib/logger";
import { XCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  className?: string;
}

export function ChangePasswordCard({ className }: Props) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      token: token,
    },
  });

  //add the token id to form data
  useEffect(() => {
    setValue("token", token);
  }, [token, setValue]);

  function onSubmit(data: ChangePasswordRequest) {
    startTransition(async () => {
      try {
        const result = await changePasswordAction(data);
        logger.info("Handle login result: ", result);
        if (result.success) {
          toast(result.message || "Password change success!", {
            variant: "success",
            description: result.description || "Login to continue",
          });
          router.push(`/login`);
        } else {
          toast(result.errorMessage || "Password change failed!", {
            variant: "error",
            description: result.description,
          });
        }
      } catch (error: unknown) {
        logger.error("Error handling password update form submit: ", error);
        toast("Something went wrong.", {
          variant: "error",
          description: "Please try again later",
        });
      }
    });
  }

  if (!token) {
    return (
      <Card className="flex flex-col items-center justify-center p-4">
        <CardHeader className="flex flex-col items-center gap-1">
          <XCircle
            height={70}
            width={70}
            className="rounded rounded-full w-fit p-2 bg-error text-fg-error"
          />
          <h1 className="font-bold text-xl text-center">
            Invalid Verification Link
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col mt-1 text-fg-secondary items-center justify-center">
          <p className="text-sm text-center">
            The verification token is missing or invalid. Please check your
            email link or try signing up again.
          </p>
        </CardBody>
        <CardFooter className="flex flex-col items-center justify-center gap-2">
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md p-4 mx-auto", className)}>
      <CardHeader className="flex flex-col gap-1 mb-4">
        <h1 className="text-fg-primary text-3xl font-bold text-center">
          Change Password
        </h1>
        <p className="text-fg-secondary text-center mt-1">
          Set a new password for your account
        </p>
      </CardHeader>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/*we need a hidden input field for the token*/}
        <input type="hidden" {...register("token")} />

        <CardBody className="flex flex-col gap-3">
          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-1 relative group">
            <Label>New Password</Label>
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

          {/* Confirm Password */}
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
                  {errors.confirm_password.message || "Passwords do not match."}
                </p>
              </>
            )}
          </div>
        </CardBody>

        <CardFooter className="mt-4">
          <Button
            className="w-full flex items-center justify-center"
            type="submit"
            disabled={isPending}
          >
            Change Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
