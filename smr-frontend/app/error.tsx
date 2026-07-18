"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@smr/ui";
import { ArrowLeft, Home, RefreshCw, AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to the console or an external error reporting service
    logger.error("Next.js Error Boundary caught an error:", error);
  }, [error]);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-6 py-12 text-center">
      <div className="relative flex flex-col items-center max-w-md w-full p-8 bg-surface-card rounded-2xl border border-border-subtle shadow-xl transition-all duration-300 hover:shadow-2xl">
        
        {/* Animated Error Icon Header */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-error-surface to-error-surface/60 border border-error-border shadow-inner">
          <AlertTriangle className="h-12 w-12 text-error-content animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="mt-12 text-3xl font-extrabold tracking-tight text-content-primary">
          Something went wrong
        </h1>

        {/* Informative Message */}
        <p className="mt-4 text-base text-content-secondary leading-relaxed">
          An unexpected error occurred while rendering this page.
        </p>

        {/* Error Details (if available) */}
        {error.message && (
          <div className="mt-4 w-full p-3 bg-surface-muted border border-border-subtle rounded-lg text-left text-xs font-mono text-content-secondary overflow-x-auto max-h-32">
            <span className="font-bold text-fg-danger">Error:</span> {error.message}
            {error.digest && (
              <div className="mt-1 text-content-tertiary">
                <span className="font-bold">Digest:</span> {error.digest}
              </div>
            )}
          </div>
        )}

        {/* Navigation & Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            variant="secondary"
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            variant="secondary"
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Link href="/" passHref className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="flex items-center justify-center gap-2 w-full"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
