export interface DriverRecordEntity {
  recordId: string;
  applicationId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseFile: string;
  createdAt: Date;
  updatedAt: Date;
}
