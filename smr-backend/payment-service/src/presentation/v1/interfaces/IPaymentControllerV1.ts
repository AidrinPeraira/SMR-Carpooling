import { Request, Response } from "express";

export interface IPaymentControllerV1 {
  createBookingPaymentOrder(req: Request, res: Response): Promise<void>;
  verifyBookingPayment(req: Request, res: Response): Promise<void>;
}
