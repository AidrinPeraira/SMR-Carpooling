"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, useToast } from "@sharemyride/ui";
import {
  RenewDriverApplicationSchema,
  RenewDriverApplicationSchemaType,
} from "@sharemyride/shared";
import { logger } from "@/lib/logger";

import { DriverFieldsSection } from "../components/sections/DriverFieldsSection";
import { DriverOverviewCard } from "../components/sections/DriverOverviewCard";

interface Props {
  initialValues?: Partial<RenewDriverApplicationSchemaType>;
  onSubmitAction?: (data: RenewDriverApplicationSchemaType) => Promise<any>;
}

export function DriverRenewalForm({ initialValues, onSubmitAction }: Props) {
  const [step, setStep] = useState<"fill" | "review">("fill");
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RenewDriverApplicationSchemaType>({
    resolver: zodResolver(RenewDriverApplicationSchema) as any,
    values: initialValues as RenewDriverApplicationSchemaType,
  });

  async function handleProceedToReview() {
    const isValid = await trigger();
    if (isValid) {
      setStep("review");
    } else {
      toast("Please fix form errors before reviewing.", { variant: "error" });
    }
  }

  function onSubmit(data: RenewDriverApplicationSchemaType) {
    startTransition(async () => {
      try {
        logger.info("Submitting Driver Renewal Application data: ", data);

        if (onSubmitAction) {
          await onSubmitAction(data);
        }

        toast("Driver Renewal Submitted!", {
          variant: "success",
          description: "Your driver renewal details have been logged successfully.",
        });
      } catch (error) {
        logger.error("Error submitting driver renewal form: ", error);
        toast("Submission error", {
          variant: "error",
          description: "Something went wrong while submitting.",
        });
      }
    });
  }

  const formData = getValues();

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      {step === "fill" ? (
        <>
          <DriverFieldsSection register={register} errors={errors} />

          <Button type="button" onClick={handleProceedToReview} className="w-full">
            Review Driver Details
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-content-primary">Review Renewal Details</h2>
            <p className="text-xs text-content-secondary">
              Verify license information before final submission.
            </p>

            <DriverOverviewCard data={formData} onEdit={() => setStep("fill")} />
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setStep("fill")}
              className="w-1/2"
            >
              Back to Edit
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-1/2 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="w-4 h-4" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Confirm & Submit"
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
