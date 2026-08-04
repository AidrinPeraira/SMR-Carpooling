import { Request, Response } from "express";

export interface IApplicationControllerV1 {
  getFileUploadUrl(req: Request, res: Response): Promise<void>;
  onboardingApplication(req: Request, res: Response): Promise<void>;
  newVehicleApplication(req: Request, res: Response): Promise<void>;
  renewDriverApplication(req: Request, res: Response): Promise<void>;
  renewVehicleApplication(req: Request, res: Response): Promise<void>;
  resubmitOnboardingApplication(req: Request, res: Response): Promise<void>;
  resubmitNewVehicleApplication(req: Request, res: Response): Promise<void>;
  resubmitRenewDriverApplication(req: Request, res: Response): Promise<void>;
  resubmitRenewVehicleApplication(req: Request, res: Response): Promise<void>;
  getApplications(req: Request, res: Response): Promise<void>;
  getApplicationDetails(req: Request, res: Response): Promise<void>;
}
