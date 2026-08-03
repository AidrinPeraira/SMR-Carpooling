"use client";

import { ApplicationDetailsResult } from "@sharemyride/shared";
import { AdminReturnBanner } from "../components/AdminReturnBanner";
import { NewVehicleApplicationForm } from "../forms/NewVehicleApplicationForm";
import { mapApplicationPrefillData } from "../utils/mapApplicationPrefillData";

interface Props {
  existingDetails?: ApplicationDetailsResult;
  onSubmitAction?: (data: any) => Promise<any>;
}

export function NewVehicleApplicationView({ existingDetails, onSubmitAction }: Props) {
  const initialValues = mapApplicationPrefillData(existingDetails);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary">New Vehicle Application</h1>
        <p className="text-sm text-content-secondary mt-1">
          Register a new vehicle to your driver profile.
        </p>
      </div>

      <AdminReturnBanner comments={existingDetails?.admin_comments} />

      <NewVehicleApplicationForm
        initialValues={initialValues}
        onSubmitAction={onSubmitAction}
      />
    </div>
  );
}
