export interface RenewDriverApplicationRequsetDTO {
  userId: string;

  licenseNumber: string;

  licenseExpiry: Date;
  licenseFile: string;
}
