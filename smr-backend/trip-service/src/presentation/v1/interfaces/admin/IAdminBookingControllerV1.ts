import { Request, Response, NextFunction } from "express";

export interface IAdminBookingControllerV1 {
  listAllBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  getBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
