import { ApplicationDetailsResult } from "@sharemyride/shared";

/**
 * Helper function to populate form data if available for resubmit and renewal views
 *
 * @param details : Full application details
 */
export function mapApplicationPrefillData(
  details?: ApplicationDetailsResult,
): Record<string, unknown> | undefined {
  if (!details) return undefined;

  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    return typeof date === "string"
      ? date.split("T")[0]
      : new Date(date).toISOString().split("T")[0];
  };

  const driverRec = Array.isArray(details.driver_record)
    ? details.driver_record[0]
    : details.driver_record;
  const vehicleRec = Array.isArray(details.vehicle_record)
    ? details.vehicle_record[0]
    : details.vehicle_record;

  return {
    // Driver fields
    license_number: driverRec?.license_number ?? "",
    license_expiry: formatDate(driverRec?.license_expiry),
    license_file: driverRec?.license_file ?? "",

    // Vehicle fields
    vehicle_type: vehicleRec?.vehicle_type,
    vehicle_make: vehicleRec?.vehicle_make ?? "",
    vehicle_model: vehicleRec?.vehicle_model ?? "",
    vehicle_capacity: vehicleRec?.vehicle_capacity ?? 4,
    registration_number: vehicleRec?.registration_number ?? "",
    registration_expiry: formatDate(vehicleRec?.registration_expiry),
    registration_file: vehicleRec?.registration_file ?? "",
    insurance_number: vehicleRec?.insurance_number ?? "",
    insurance_expiry: formatDate(vehicleRec?.insurance_expiry),
    insurance_file: vehicleRec?.insurance_file ?? "",
    vehicle_image: vehicleRec?.vehicle_image ?? "",
  };
}
