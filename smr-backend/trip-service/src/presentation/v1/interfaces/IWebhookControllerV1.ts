import { Request, Response, NextFunction } from "express";

export interface IWebhookControllerV1 {
  cleanupBookingPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
