import { Request, Response } from "express";

export interface IAdminVehicleRecordControllerV1 {
  getAllVehicleRecords(req: Request, res: Response): Promise<void>;
  getVehicleRecordDetails(req: Request, res: Response): Promise<void>;
}
