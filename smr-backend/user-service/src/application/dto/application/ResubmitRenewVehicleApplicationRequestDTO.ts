export interface ResubmitRenewVehicleApplicationRequestDTO {
  applicationId: string;

  registrationNumber?: string;
  registrationExpiry?: Date;
  registrationFile?: string;

  insuranceNumber?: string;
  insuranceExpiry?: Date;
  insuranceFile?: string;
}
