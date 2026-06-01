import { Request, Response } from "express";

export interface IAuthControllerV1 {
  signup(req: Request, res: Response): Promise<void>;
}
