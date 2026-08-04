"use client";

import { AdminReturnBanner } from "@/features/application/components/AdminReturnBanner";
import { OnboardingApplicationForm } from "@/features/application/forms/OnboardingApplicationForm";
import { mapApplicationPrefillData } from "@/features/application/utils/mapApplicationPrefillData";
import { ApplicationDetailsResult, OnboardingApplicationSchemaType } from "@sharemyride/shared";

interface Props {
  existingDetails?: ApplicationDetailsResult;
  onSubmitAction?: (data: OnboardingApplicationSchemaType) => Promise<unknown>;
}

export function OnboardingApplicationView({
  existingDetails,
  onSubmitAction,
}: Props) {
  const initialValues = mapApplicationPrefillData(existingDetails);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary">
          Driver & Vehicle Onboarding
        </h1>
        <p className="text-sm text-content-secondary mt-1">
          Submit your driver license and vehicle details for admin approval.
        </p>
      </div>

      <AdminReturnBanner comments={existingDetails?.admin_comments} />

      <OnboardingApplicationForm
        initialValues={initialValues}
        onSubmitAction={onSubmitAction}
      />
    </div>
  );
}
