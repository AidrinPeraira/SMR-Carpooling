import { Request, Response } from "express";

export interface IAdminUserControllerV1 {
  getAllUsers(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
  unBlockUser(req: Request, res: Response): Promise<void>;
}
