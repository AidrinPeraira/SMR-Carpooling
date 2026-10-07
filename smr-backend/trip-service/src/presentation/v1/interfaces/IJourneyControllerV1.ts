import { Request, Response, NextFunction } from "express";

export interface IJourneyControllerV1 {
  startJourney(req: Request, res: Response, next: NextFunction): Promise<void>;
}
