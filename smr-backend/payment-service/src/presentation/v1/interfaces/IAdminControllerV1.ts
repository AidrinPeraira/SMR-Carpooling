import { Request, Response } from "express";

export interface IAdminControllerV1 {
  listTransactions(req: Request, res: Response): Promise<void>;
  getTransactionsSummary(req: Request, res: Response): Promise<void>;
  getRevenueTrend(req: Request, res: Response): Promise<void>;
}
