import { NextFunction, Request, Response } from "express";

export interface IWalletControllerV1 {
  getWalletTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
