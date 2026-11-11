import { Request, Response } from "express";

export interface IWebhookControllerV1 {
  clearBookingPayment(req: Request, res: Response): Promise<void>;
}
