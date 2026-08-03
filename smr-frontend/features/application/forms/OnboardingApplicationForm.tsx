"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader, useToast } from "@sharemyride/ui";
import {
  OnboardingApplicationSchema,
  OnboardingApplicationSchemaType,
} from "@sharemyride/shared";
import { logger } from "@/lib/logger";
import { DriverFieldsSection } from "@/features/application/components/sections/DriverFieldsSection";
import { VehicleFieldsSection } from "@/features/application/components/sections/VehicleFieldsSection";
import { DriverOverviewCard } from "@/features/application/components/sections/DriverOverviewCard";
import { VehicleOverviewCard } from "@/features/application/components/sections/VehicleOverviewCard";

interface Props {
  initialValues?: Partial<OnboardingApplicationSchemaType>;
  onSubmitAction?: (data: OnboardingApplicationSchemaType) => Promise<any>;
}

export function OnboardingApplicationForm({
  initialValues,
  onSubmitAction,
}: Props) {
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
  } = useForm<OnboardingApplicationSchemaType>({
    resolver: zodResolver(OnboardingApplicationSchema) as any,
    values: initialValues as OnboardingApplicationSchemaType,
  });

  async function handleProceedToReview() {
    const isValid = await trigger();
    if (isValid) {
      setStep("review");
    } else {
      toast("Please fix form errors before reviewing.", { variant: "error" });
    }
  }

  function onSubmit(data: OnboardingApplicationSchemaType) {
    startTransition(async () => {
      try {
        logger.info("Submitting Onboarding Application data: ", data);

        if (onSubmitAction) {
          await onSubmitAction(data);
        }

        // Dummy placeholder submit success
        toast("Onboarding Application Submitted!", {
          variant: "success",
          description:
            "Your driver & vehicle details have been logged successfully.",
        });
      } catch (error) {
        logger.error("Error submitting onboarding application form: ", error);
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
          <DriverFieldsSection
            register={register}
            control={control}
            errors={errors}
          />
          <VehicleFieldsSection
            register={register}
            control={control}
            errors={errors}
          />

          <Button
            type="button"
            onClick={handleProceedToReview}
            className="w-full"
          >
            Review Application
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-content-primary">
              Review Application Details
            </h2>
            <p className="text-xs text-content-secondary">
              Verify your information carefully before final submission.
            </p>

            <DriverOverviewCard
              data={formData}
              onEdit={() => setStep("fill")}
            />
            <VehicleOverviewCard
              data={formData}
              onEdit={() => setStep("fill")}
            />
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
