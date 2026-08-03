"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, useToast } from "@sharemyride/ui";
import {
  RenewVehicleApplicationSchema,
  RenewVehicleApplicationSchemaType,
} from "@sharemyride/shared";
import { logger } from "@/lib/logger";

import { VehicleFieldsSection } from "../components/sections/VehicleFieldsSection";
import { VehicleOverviewCard } from "../components/sections/VehicleOverviewCard";

interface Props {
  initialValues?: Partial<RenewVehicleApplicationSchemaType>;
  onSubmitAction?: (data: RenewVehicleApplicationSchemaType) => Promise<any>;
}

export function VehicleRenewalForm({ initialValues, onSubmitAction }: Props) {
  const [step, setStep] = useState<"fill" | "review">("fill");
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    control,
    formState: { errors },
  } = useForm<RenewVehicleApplicationSchemaType>({
    resolver: zodResolver(RenewVehicleApplicationSchema) as any,
    values: initialValues as RenewVehicleApplicationSchemaType,
  });

  async function handleProceedToReview() {
    const isValid = await trigger();
    if (isValid) {
      setStep("review");
    } else {
      toast("Please fix form errors before reviewing.", { variant: "error" });
    }
  }

  function onSubmit(data: RenewVehicleApplicationSchemaType) {
    startTransition(async () => {
      try {
        logger.info("Submitting Vehicle Renewal Application data: ", data);

        if (onSubmitAction) {
          await onSubmitAction(data);
        }

        toast("Vehicle Renewal Submitted!", {
          variant: "success",
          description: "Your vehicle renewal details have been logged successfully.",
        });
      } catch (error) {
        logger.error("Error submitting vehicle renewal form: ", error);
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
          <VehicleFieldsSection register={register} control={control} errors={errors} />

          <Button type="button" onClick={handleProceedToReview} className="w-full">
            Review Vehicle Details
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-content-primary">Review Renewal Details</h2>
            <p className="text-xs text-content-secondary">
              Verify registration and insurance dates before final submission.
            </p>

            <VehicleOverviewCard data={formData} onEdit={() => setStep("fill")} />
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
