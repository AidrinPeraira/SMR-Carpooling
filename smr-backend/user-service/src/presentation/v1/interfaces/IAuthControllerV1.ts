import { Request, Response } from "express";

export interface IAuthControllerV1 {
  signup(req: Request, res: Response): Promise<void>;
  verifySignupEmail(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  googleAuth(req: Request, res: Response): Promise<void>;
}
