import { DriverStatus } from "@sharemyride/shared";

export interface UpdateDriverRequestDTO {
  driverId: string;
  recordId?: string;
  licenseNumber?: string;
  licenseImage?: string;
  driverStatus?: DriverStatus;
}
