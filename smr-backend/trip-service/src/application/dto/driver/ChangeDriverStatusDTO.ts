import { DriverStatus } from "@sharemyride/shared";

export interface ChangeDriverStatusDTO {
  driverId: string;
  driverStatus: DriverStatus;
}
