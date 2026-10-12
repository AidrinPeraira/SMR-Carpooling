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

  /** Retrieves the full journey details including all passengers for admin review. */
  getJourneyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
