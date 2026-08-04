import { Request, Response, NextFunction } from "express";

export interface IAdminDriverControllerV1 {
  getDriverDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
}
