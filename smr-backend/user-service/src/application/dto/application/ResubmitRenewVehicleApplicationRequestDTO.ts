export interface ResubmitRenewVehicleApplicationRequestDTO {
  applicationId: string;

  registrationNumber?: string;
  registrationExpiry?: string;
  registrationFile?: string;

  insuranceNumber?: string;
  insuranceExpiry?: string;
  insuranceFile?: string;
}
