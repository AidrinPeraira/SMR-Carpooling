"use client";

import { AdminReturnBanner } from "@/features/application/components/AdminReturnBanner";
import { VehicleRenewalForm } from "@/features/application/forms/VehicleRenewalForm";
import { mapApplicationPrefillData } from "@/features/application/utils/mapApplicationPrefillData";
import { ApplicationDetailsResult, RenewVehicleApplicationSchemaType } from "@sharemyride/shared";

interface Props {
  existingDetails?: ApplicationDetailsResult;
  onSubmitAction?: (data: RenewVehicleApplicationSchemaType) => Promise<unknown>;
}

export function VehicleRenewalView({ existingDetails, onSubmitAction }: Props) {
  const initialValues = mapApplicationPrefillData(existingDetails);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary">
          Vehicle Renewal
        </h1>
        <p className="text-sm text-content-secondary mt-1">
          Renew vehicle registration and insurance information.
        </p>
      </div>

      <AdminReturnBanner comments={existingDetails?.admin_comments} />

      <VehicleRenewalForm
        initialValues={initialValues}
        onSubmitAction={onSubmitAction}
      />
    </div>
  );
}
