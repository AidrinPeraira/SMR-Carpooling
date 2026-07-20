"use client";
import { useToast } from "@sharemyride/ui";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function QueryToastHandler() {
  const queryParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    //here we get the messages if they exist
    const errorMessage = queryParams.get("error");
    const warnMessage = queryParams.get("warn");
    const successMessage = queryParams.get("success");

    //toast the messages
    if (errorMessage) {
      toast(errorMessage, { variant: "error" });
    }
    if (warnMessage) {
      toast(warnMessage, { variant: "warn" });
    }
    if (successMessage) {
      toast(successMessage, { variant: "success" });
    }

    //clear the params after toasting
    if (errorMessage || warnMessage || successMessage) {
      const params = new URLSearchParams(queryParams.toString());

      params.delete("error");
      params.delete("warn");
      params.delete("success");

      const remainingQuery = params.toString();

      const cleanUrl =
        window.location.pathname + (remainingQuery ? `?${remainingQuery}` : "");

      window.history.replaceState(null, "", cleanUrl);
    }
  }, [queryParams, toast]);

  return null;
}

export function QueryToastListener() {
  return (
    <Suspense fallback={null}>
      <QueryToastHandler />
    </Suspense>
  );
}
