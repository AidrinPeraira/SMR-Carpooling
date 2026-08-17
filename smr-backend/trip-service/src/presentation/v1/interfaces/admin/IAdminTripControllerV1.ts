import { Request, Response, NextFunction } from "express";

export interface IAdminTripControllerV1 {
  listAllTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  getTripDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
