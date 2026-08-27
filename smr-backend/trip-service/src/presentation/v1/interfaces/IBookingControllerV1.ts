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

  getPassengerBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  getPassengerBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  withdrawBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  initiateBookingPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
}
