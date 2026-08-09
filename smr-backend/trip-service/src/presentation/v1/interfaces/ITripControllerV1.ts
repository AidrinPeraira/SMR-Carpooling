import { Request, Response, NextFunction } from "express";

export interface ITripControllerV1 {
  createTrip(req: Request, res: Response, next: NextFunction): Promise<void>;
  listMatchingTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
