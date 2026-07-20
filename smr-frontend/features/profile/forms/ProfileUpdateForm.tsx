"use client";

import {
  UpdateUserRequest,
  UpdateUserSchema,
  GetUserResult,
} from "@sharemyride/shared";
import {
  Avatar,
  Button,
  cn,
  Dialog,
  Input,
  Label,
  Loader,
  useToast,
} from "@sharemyride/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { logger } from "@/lib/logger";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserRequest } from "@/features/profile/api/requests/getUserRequest";
import { updateUserAction } from "@/features/profile/api/actions/UpdateUserAction";

interface Props {
  className?: string;
}

export function ProfileUpdateForm({ className }: Props) {
  const [isPending, startTransition] = useTransition();
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const toast = useToast();

  const queryClient = useQueryClient();
  const getUserQuery = useQuery<GetUserResult>({
    queryKey: ["currentUser"],
    queryFn: getUserRequest,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const user = getUserQuery.data;

  //react hook form set up
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserRequest>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(UpdateUserSchema as any),
    values: user
      ? {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          password: "",
        }
      : undefined,
  });

  //loading the form while getting the user:W
  if (getUserQuery.isLoading) {
    return (
      <div
        className={cn(
          "w-full flex flex-col items-center justify-center p-8 min-h-[300px]",
          className,
        )}
      >
        <Loader className="w-8 h-8 text-primary " />
        <p className="text-sm text-fg-secondary mt-2">
          Loading profile details...
        </p>
      </div>
    );
  }

  //if getting the user is error
  if (getUserQuery.isError || !user) {
    return (
      <div
        className={cn(
          "w-full text-center p-8 min-h-[300px] flex flex-col items-center justify-center",
          className,
        )}
      >
        <p className="text-fg-danger font-semibold mb-2">
          Failed to load profile details
        </p>
        <p className="text-xs text-fg-secondary mb-4">
          Please verify you are logged in and try again.
        </p>
      </div>
    );
  }

  function onSubmit(data: UpdateUserRequest) {
    if (!user) return;
    startTransition(async () => {
      try {
        const payload: UpdateUserRequest = {
          user_id: user.user_id,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
        };

        const result = await updateUserAction(payload);

        if (result.success) {
          if (result.payload) {
            queryClient.setQueryData(["currentUser"], result.payload);
            queryClient.setQueryDefaults(["currentUser"], {
              staleTime: Infinity,
              gcTime: Infinity,
            });
          }

          toast("Profile update success", {
            variant: "success",
            description: result.message || "Your updates have been stored.",
          });
        } else {
          logger.error("Failed to update user profile", result);
          toast("Profile update failed", {
            variant: "error",
            description: result.errorMessage,
          });
        }
      } catch (error: unknown) {
        logger.error("Error updating profile:", error);
        toast("Failed to update profile", {
          variant: "error",
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }

  /**
   * Function to request password reset token
   */
  async function handleForgotPassword() {
    if (!user) return;
    const email = user.email_id;
    console.log("Sending password reset mail request for email:", email);
    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email }),
      });
      if (!response.ok) {
        throw new Error("Failed to send password reset request");
      }
      const result = await response.json();
      if (result.success) {
        toast("Password change request received!", {
          variant: "success",
          description:
            "Please check the registered mail for instructions regarding changing / resetting your password",
        });
      }
    } catch (error: unknown) {
      logger.error("Error requesting for password change: ", error);
      toast("Error requesting for password change.", {
        variant: "error",
        description: "Please try again later.",
      });
    }
  }

  return (
    <div className={cn("w-full rounded", className)}>
      <div className="mb-5 text-center flex flex-col items-center">
        {/* Profile Image Avatar */}
        <div className="mb-4 flex flex-col items-center">
          <Avatar
            src={user.profile_image}
            initials={`${user.first_name[0]}${user.last_name[0]}`}
            size="lg"
          />
          <span className="text-xs text-primary font-semibold mt-2 cursor-pointer hover:underline">
            Change Photo
          </span>
        </div>

        <h1 className="text-fg-primary text-2xl font-bold">Update Profile</h1>
        <p className="text-fg-secondary mt-1 text-sm">
          Keep your account details up to date
        </p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Grid for First & Last Name */}
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
                  {errors.first_name.message}
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
                  {errors.last_name.message}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="9876543210"
            {...register("phone_number")}
          />
          {errors.phone_number && (
            <>
              <p className="text-xs font-semibold pl-1 text-fg-danger">
                Invalid Entry
              </p>
              <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                {errors.phone_number.message}
              </p>
            </>
          )}
        </div>

        {/* Password Confirmation section */}
        <div className="border-t border-border-subtle pt-4 mt-2">
          <p className="text-xs font-semibold text-fg-secondary mb-3 text-center">
            Confirm changes by entering your password
          </p>

          <div className="flex flex-col gap-1 relative group">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required for confirmation",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && (
              <>
                <p className="text-xs font-semibold pl-1 text-fg-danger">
                  Invalid Entry
                </p>
                <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 bottom-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
                  {errors.password.message}
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
              <span>Saving Changes...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-fg-secondary border-t border-border-subtle pt-4">
        Want to change your password?{" "}
        <button
          type="button"
          onClick={() => setChangePasswordDialogOpen(true)}
          className="text-primary font-semibold hover:underline cursor-pointer"
        >
          Click here
        </button>
      </div>

      {/* Dialog box for confirm password reset */}
      <Dialog
        isOpen={changePasswordDialogOpen}
        onClose={() => {
          setChangePasswordDialogOpen(false);
        }}
        header="Submit Password Reset Request?"
        description={`You will be sent an email to ${user.email_id} with instructions to change / reset your password.`}
        confirmAction={async () => {
          await handleForgotPassword();
          setChangePasswordDialogOpen(false);
        }}
      />
    </div>
  );
}
