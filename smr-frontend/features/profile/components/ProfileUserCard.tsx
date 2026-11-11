"use client";

import { Button, Card, CardHeader, CardBody, Loader, useToast } from "@sharemyride/ui";
import { GetUserResult, UserRole } from "@sharemyride/shared";
import { Edit, RefreshCw, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { changeRoleAction } from "../api/actions/ChangeRoleAction";

interface Props {
  user: GetUserResult | null;
}

export function ProfileUserCard({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!user) {
    return <Card>No user data fetched</Card>;
  }

  const memberSince = new Date(user.created_at).toLocaleDateString();
  const avatarUrl = user?.profile_image || "";
  const targetRole =
    user.user_role === UserRole.DRIVER ? UserRole.PASSENGER : UserRole.DRIVER;

  const handleSwitchRole = () => {
    startTransition(async () => {
      const response = await changeRoleAction();

      if (response.success) {
        toast(`Switched role to ${targetRole}`, {
          description: "Your active role has been updated.",
        });
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        router.refresh();
      } else {
        toast("Role switch failed", {
          description: response.description || "Failed to switch user role",
        });
      }
    });
  };

  return (
    <>
      <Card className="p-6">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-accent shadow-sm bg-surface-muted flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-content-tertiary" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-content-primary">
                {`${user.first_name} ${user.last_name}`}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent uppercase mt-1">
                {user.user_role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              variant="secondary"
              onClick={handleSwitchRole}
              disabled={isPending}
              className="flex items-center gap-1.5 text-xs py-1.5"
            >
              {isPending ? (
                <Loader className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Switch to {targetRole}
            </Button>

            <Link href="/profile/update-profile">
              <Edit className="w-5 h-5 text-content-tertiary cursor-pointer hover:text-primary transition-colors" />
            </Link>
          </div>
        </CardHeader>

        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0 border-t border-border-subtle pt-6">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              First Name
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.first_name}
            </p>
          </div>

          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Last Name
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.last_name}
            </p>
          </div>

          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Email Address
            </label>
            <p className="text-sm font-semibold text-content-primary break-all">
              {user.email_id}
            </p>
          </div>

          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Phone Number
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {user.phone_number}
            </p>
          </div>

          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Member Since
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {memberSince}
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
