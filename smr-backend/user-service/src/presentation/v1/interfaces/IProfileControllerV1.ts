import { Request, Response } from "express";

export interface IProfileControllerV1 {
  getUser(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  getAvatarUploadUrl(req: Request, res: Response): Promise<void>;
  updateAvatar(req: Request, res: Response): Promise<void>;
  switchUserRole(req: Request, res: Response): Promise<void>;
}
