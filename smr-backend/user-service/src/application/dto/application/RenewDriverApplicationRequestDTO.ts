export interface RenewDriverApplicationRequestDTO {
  userId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseFile: string;
}

export type RenewDriverApplicationRequsetDTO = RenewDriverApplicationRequestDTO;
