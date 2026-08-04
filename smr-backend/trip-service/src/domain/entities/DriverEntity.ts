import { DriverStatus } from "@sharemyride/shared";

export interface DriverEntity {
  driverId: string; //matches to user id in user service
  recordId: string;
  licenseNumber: string;
  licenseImage: string;
  driverStatus: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}
