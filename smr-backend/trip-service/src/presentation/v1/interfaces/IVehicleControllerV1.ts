import { Request, Response, NextFunction } from "express";

export interface IVehicleControllerV1 {
  getDriverVehicles(req: Request, res: Response, next: NextFunction): Promise<void>;
}
