"use client";

import { cn } from "@/lib/utils";
import {
  CredentialResponse,
  GoogleLogin as GoogleLoginButton,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { googleLoginAction } from "@/features/auth/api/actions/GoogleLoginAction";
import { useToast } from "@sharemyride/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logger } from "@/lib/logger";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  className?: string;
}

export function GoogleLogin({ className }: Props) {
  const [, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const googleClientId = String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "");
  const toast = useToast();
  const router = useRouter();

  function handleGoogleLogin(credentialResponse: CredentialResponse) {
    const token = credentialResponse.credential;
    if (!token) {
      toast("Google login failed.", {
        variant: "error",
        description: "No credential returned from Google.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await googleLoginAction(token);
        logger.info("Handle Google login result: ", result);
        if (result.success) {
          if (result.payload?.user) {
            queryClient.setQueryData(["currentUser"], result.payload.user);
            queryClient.setQueryDefaults(["currentUser"], {
              staleTime: Infinity,
              gcTime: Infinity,
            });
          }

          toast(result.message || "Google login success!", {
            variant: "success",
            description: result.description,
          });
          const role = result.payload?.user.user_role.toLowerCase();
          router.replace(`/${role ? role : ""}`);
        } else {
          toast(result.errorMessage || "Google login failed!", {
            variant: "error",
            description: result.description,
          });
        }
      } catch (error: unknown) {
        logger.error("Error handling Google login: ", error);
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
        "mx-auto w-full flex flex-row items-center justify-center",
        className,
      )}
    >
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleLoginButton
          onSuccess={handleGoogleLogin}
          theme="outline"
          logo_alignment="center"
          ux_mode="popup"
          cancel_on_tap_outside
          useOneTap
        />
      </GoogleOAuthProvider>
    </div>
  );
}
