export interface ResubmitRenewDriverApplicationRequestDTO {
  applicationId: string;

  licenseNumber?: string;
  licenseExpiry?: Date;
  licenseFile?: string;
}
