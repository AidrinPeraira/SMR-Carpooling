import { Request, Response } from "express";

export interface IProfileControllerV1 {
  getUser(req: Request, res: Response): Promise<void>;
}
