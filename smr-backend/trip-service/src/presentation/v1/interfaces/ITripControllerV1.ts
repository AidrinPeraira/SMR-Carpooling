import { Request, Response, NextFunction } from "express";

export interface ITripControllerV1 {
  createTrip(req: Request, res: Response, next: NextFunction): Promise<void>;
  listMatchingTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getJourneyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getDriverTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getDriverTripDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
