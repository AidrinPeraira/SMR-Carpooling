import { Request, Response, NextFunction } from "express";

export interface IBookingControllerV1 {
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
}
