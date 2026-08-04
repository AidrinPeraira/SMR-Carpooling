"use client";

import { AdminReturnBanner } from "@/features/application/components/AdminReturnBanner";
import { DriverRenewalForm } from "@/features/application/forms/DriverRenewalForm";
import { mapApplicationPrefillData } from "@/features/application/utils/mapApplicationPrefillData";
import { ApplicationDetailsResult, RenewDriverApplicationSchemaType } from "@sharemyride/shared";

interface Props {
  existingDetails?: ApplicationDetailsResult;
  onSubmitAction?: (data: RenewDriverApplicationSchemaType) => Promise<unknown>;
}

export function DriverRenewalView({ existingDetails, onSubmitAction }: Props) {
  const initialValues = mapApplicationPrefillData(existingDetails);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary">
          Driver License Renewal
        </h1>
        <p className="text-sm text-content-secondary mt-1">
          Renew your driver license details and submit updated documents.
        </p>
      </div>

      <AdminReturnBanner comments={existingDetails?.admin_comments} />

      <DriverRenewalForm
        initialValues={initialValues}
        onSubmitAction={onSubmitAction}
      />
    </div>
  );
}
