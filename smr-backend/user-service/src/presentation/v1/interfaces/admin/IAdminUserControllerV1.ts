import { Request, Response } from "express";

export interface IAdminUserControllerV1 {
  getAllUsers(req: Request, res: Response): Promise<void>;
}
