import { DriverStatus } from "@sharemyride/shared";

export interface DriverDetailsDTO {
  driverId: string;
  recordId: string;
  licenseNumber: string;
  licenseImage: string;
  driverStatus: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}
