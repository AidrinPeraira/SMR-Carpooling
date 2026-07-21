"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@sharemyride/ui";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    // Check if browser environment and history contains a previous page
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-6 py-12 text-center">
      <div className="relative flex flex-col items-center max-w-md w-full p-8 bg-surface-card rounded-2xl border border-border-subtle shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Animated Compass Icon Header */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-accent/20 to-accent/40 border border-accent/20 shadow-inner">
          <Compass className="h-12 w-12 text-content-primary animate-pulse" />
        </div>

        {/* 404 Status Code */}
        <h1 className="mt-12 text-8xl font-black tracking-tight text-content-primary">
          404
        </h1>

        {/* Header Title */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-content-primary">
          Page Not Found
        </h2>

        {/* Helpful Message */}
        <p className="mt-3 text-base text-content-secondary leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Navigation Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            variant="secondary"
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
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
