"use client";

import { ApplicationDetailsResult } from "@sharemyride/shared";
import { AdminReturnBanner } from "../components/AdminReturnBanner";
import { DriverRenewalForm } from "../forms/DriverRenewalForm";
import { mapApplicationPrefillData } from "../utils/mapApplicationPrefillData";

interface Props {
  existingDetails?: ApplicationDetailsResult;
  onSubmitAction?: (data: any) => Promise<any>;
}

export function DriverRenewalView({ existingDetails, onSubmitAction }: Props) {
  const initialValues = mapApplicationPrefillData(existingDetails);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary">Driver License Renewal</h1>
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
