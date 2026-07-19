import { Request, Response } from "express";

/**
 * This interface defines the methods needed by the Admin Controller to handle
 * reuests that manage users
 */
export interface IAdminUserControllerV1 {
  getAllUsers(req: Request, res: Response): Promise<void>;
  getFullUserProfile(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
  unBlockUser(req: Request, res: Response): Promise<void>;
}
