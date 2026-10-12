import { NextFunction, Request, Response } from "express";

/**
 * Interface for the Payout controller (v1).
 * Defines the contract for payout-related HTTP request handlers.
 */
export interface IPayoutControllerV1 {
  getDriverPayouts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  adminListPayouts(req: Request, res: Response): Promise<void>;

  adminApprovePayout(req: Request, res: Response): Promise<void>;
}
