"use client";

import { InlineError } from "@/components/InlineError";
import { blockUserRequest } from "@/features/admin/users/api/requests/blockUserRequest";
import { getUserProfileDetails } from "@/features/admin/users/api/requests/getUserProfileDetails";
import { unBlockUserRequest } from "@/features/admin/users/api/requests/unBlockUserRequest";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  Tag,
  Loader,
  useToast,
  Dialog,
} from "@smr/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export function ProfileDetailsCard() {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();

  //dialog config for confirming user status chage
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    header: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    header: "",
    description: "",
    onConfirm: () => {},
  });

  const { isPending, data, error } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: async () => getUserProfileDetails(userId),
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
  });

  //handle blocking user
  const blockMutation = useMutation({
    mutationFn: blockUserRequest,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["userDetails", userId] });
        toast("User blocked successfully", { variant: "success" });
      } else {
        toast(res.message || "Failed to block user", { variant: "error" });
      }
    },
    onError: (err) => {
      toast(err?.message || "Failed to block user", { variant: "error" });
    },
  });

  //hdandle unblocing user
  const unblockMutation = useMutation({
    mutationFn: unBlockUserRequest,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["userDetails", userId] });
        toast("User unblocked successfully", { variant: "success" });
      } else {
        toast(res.message || "Failed to unblock user", { variant: "error" });
      }
    },
    onError: (err) => {
      toast(err?.message || "Failed to unblock user", { variant: "error" });
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // return different component in case request fails
  if (error) {
    return (
      <InlineError message={`Some error occurred : ${error}`}></InlineError>
    );
  }

  if (!data?.success || !data?.payload) {
    return (
      <InlineError
        message={`Some response error occurred : ${data?.message || "Invalid payload"}`}
      ></InlineError>
    );
  }

  const user = data.payload;

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Tag variant="accent" className="uppercase tracking-wider">
            Active
          </Tag>
        );
      case "blocked":
        return (
          <Tag
            variant="muted"
            className="bg-error-surface text-error-content border border-error-border uppercase tracking-wider"
          >
            Blocked
          </Tag>
        );
      case "pending_verification":
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border border-warning-border uppercase tracking-wider"
          >
            Pending Verification
          </Tag>
        );
      default:
        return (
          <Tag variant="muted" className="uppercase tracking-wider">
            {status}
          </Tag>
        );
    }
  };

  const formattedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedRole =
    user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1);
  const initials = (user.first_name?.[0] || "") + (user.last_name?.[0] || "");
  const isActionPending = blockMutation.isPending || unblockMutation.isPending;

  const handleBlockClick = () => {
    setDialogState({
      isOpen: true,
      header: "Suspend User Account",
      description: `Are you sure you want to suspend the account of ${user.first_name} ${user.last_name}? They will no longer be able to offer or take rides.`,
      onConfirm: () => {
        blockMutation.mutate(userId);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleUnblockClick = () => {
    setDialogState({
      isOpen: true,
      header: "Activate User Account",
      description: `Are you sure you want to activate the account of ${user.first_name} ${user.last_name} and restore their access?`,
      onConfirm: () => {
        unblockMutation.mutate(userId);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <>
      <Card className="p-6">
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar
              src={user.profile_image || ""}
              alt={`${user.first_name} ${user.last_name}`}
              initials={initials || "U"}
              size="lg"
              className="w-24 h-24 rounded-full [&>div]:w-24 [&>div]:h-24 [&>div]:text-2xl shadow-sm"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-2 mt-2 sm:mt-0">
                <h2 className="text-xl font-bold text-content-primary">
                  {`${user.first_name} ${user.last_name}`}
                </h2>
                <div className="flex gap-2 justify-center sm:justify-start">
                  {getStatusTag(user.account_status)}
                  {user.email_verified ? (
                    <Tag variant="accent" className="uppercase tracking-wider">
                      Email Verified
                    </Tag>
                  ) : (
                    <Tag variant="muted" className="uppercase tracking-wider">
                      Email Unverified
                    </Tag>
                  )}
                </div>
              </div>
              <p className="text-sm text-content-secondary">
                User ID: {user.user_id}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center w-full md:w-auto">
            {user.account_status === "blocked" ? (
              <Button
                variant="primary"
                className="flex items-center gap-1.5 py-1.5 text-xs flex-1 md:flex-none justify-center min-w-[90px]"
                disabled={isActionPending}
                onClick={handleUnblockClick}
              >
                {unblockMutation.isPending ? (
                  <Loader className="w-3.5 h-3.5 border-t-white" />
                ) : (
                  "Activate"
                )}
              </Button>
            ) : (
              <Button
                variant="danger"
                className="flex items-center gap-1.5 py-1.5 text-xs flex-1 md:flex-none justify-center min-w-[90px]"
                disabled={isActionPending}
                onClick={handleBlockClick}
              >
                {blockMutation.isPending ? (
                  <Loader className="w-3.5 h-3.5" />
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" /> Suspend
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 border-t border-border-subtle pt-6 mb-0">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Email ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.email_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              User ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.user_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Role
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {formattedRole}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Phone
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.phone_number || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Joined Date
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {formattedDate}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Driver Status
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.is_driver
                ? "Registered Driver"
                : "Not Registered as Driver"}
            </p>
          </div>
        </CardBody>
      </Card>

      <Dialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        header={dialogState.header}
        description={dialogState.description}
        confirmAction={dialogState.onConfirm}
        rejectAction={() =>
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </>
  );
}
