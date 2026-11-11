import { Request, Response } from "express";

export interface IAdminConfigurationControllerV1 {
  getConfigurations(req: Request, res: Response): Promise<void>;
  createPricing(req: Request, res: Response): Promise<void>;
  updatePricing(req: Request, res: Response): Promise<void>;
  createVehicle(req: Request, res: Response): Promise<void>;
  updateVehicle(req: Request, res: Response): Promise<void>;
}
