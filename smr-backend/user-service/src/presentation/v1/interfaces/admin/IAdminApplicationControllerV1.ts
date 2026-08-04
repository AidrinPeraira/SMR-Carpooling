import { Request, Response } from "express";

export interface IAdminApplicationControllerV1 {
  getAllApplications(req: Request, res: Response): Promise<void>;
  getApplicationDetails(req: Request, res: Response): Promise<void>;
  processApplication(req: Request, res: Response): Promise<void>;
}
