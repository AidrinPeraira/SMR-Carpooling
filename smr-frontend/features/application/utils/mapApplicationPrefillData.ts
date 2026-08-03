import { ApplicationDetailsResult } from "@sharemyride/shared";

export function mapApplicationPrefillData(details?: ApplicationDetailsResult): any {
  if (!details) return undefined;

  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    return typeof date === "string"
      ? date.split("T")[0]
      : new Date(date).toISOString().split("T")[0];
  };

  return {
    // Driver fields
    license_number: details.driver_record?.license_number ?? "",
    license_expiry: formatDate(details.driver_record?.license_expiry),
    license_file: details.driver_record?.license_file ?? "",

    // Vehicle fields
    vehicle_type: details.vehicle_record?.vehicle_type,
    vehicle_make: details.vehicle_record?.vehicle_make ?? "",
    vehicle_model: details.vehicle_record?.vehicle_model ?? "",
    vehicle_capacity: details.vehicle_record?.vehicle_capacity ?? 4,
    registration_number: details.vehicle_record?.registration_number ?? "",
    registration_expiry: formatDate(details.vehicle_record?.registration_expiry),
    registration_file: details.vehicle_record?.registration_file ?? "",
    insurance_number: details.vehicle_record?.insurance_number ?? "",
    insurance_expiry: formatDate(details.vehicle_record?.insurance_expiry),
    insurance_file: details.vehicle_record?.insurance_file ?? "",
    vehicle_image: details.vehicle_record?.vehicle_image ?? "",
  };
}
