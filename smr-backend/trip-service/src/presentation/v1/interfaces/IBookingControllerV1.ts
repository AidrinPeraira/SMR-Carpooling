import { Request, Response, NextFunction } from "express";

export interface IBookingControllerV1 {
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDriverBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getDriverBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  acceptBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
}
