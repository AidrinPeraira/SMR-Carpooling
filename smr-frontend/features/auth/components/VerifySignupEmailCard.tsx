"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Loader,
} from "@smr/ui";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function VerifySignupEmailCard() {
  const [pending, setPending] = useState(true);
  const redirectSecondsRemaining = 10;

  useEffect(() => {
    setTimeout(() => {
      setPending(false);
    }, 5000);
  }, []);

  if (pending) {
    return (
      <Card className="flex flex-col items-center justify-center  p-4">
        <CardHeader className="flex flex-col items-center gap-1">
          <Loader className="w-16 h-16 border-7 border-t-fg-secondary" />
          <h1 className="font-bold text-xl">Your email is being verified!</h1>
        </CardHeader>
        <CardBody className="flex flex-col mt-1 text-fg-secondary align-center justify-center ">
          <p className="text-lg text-center mt-1">
            Thank you for joining ShareMyRide. You can start rifding very soon.
          </p>
        </CardBody>
        <CardFooter className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-fg-secondary">
            You&apos;ll be redirected shortly
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center justify-center  p-4">
      <CardHeader className="flex flex-col items-center gap-1">
        <CheckCircle
          height={70}
          width={70}
          className="rounded rounded-full w-fit p-2 bg-accent text-fg-accent"
        />
        <h1 className="font-bold text-xl">Email verified succesfully!</h1>
      </CardHeader>
      <CardBody className="flex flex-col mt-1 text-fg-secondary align-center justify-center ">
        <p className="text-sm text-center">
          Thank you for verifying your email. You can now access all
          features.{" "}
        </p>
        <p className="text-lg text-center mt-1"> Welcome to Share My Ride!</p>
      </CardBody>
      <CardFooter className="flex flex-col items-center justify-center gap-2">
        <Link href="/">
          <Button>Continue to ShareMyRide</Button>
        </Link>
        <p className="text-sm text-fg-secondary">
          Redirecting to home page in {redirectSecondsRemaining}s...
        </p>
      </CardFooter>
    </Card>
  );
}
