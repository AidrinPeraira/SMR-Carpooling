import { Request, Response, NextFunction } from "express";

export interface IJourneyControllerV1 {
  startJourney(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDriverJourneyDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPassengerJourneyDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  driverArrived(req: Request, res: Response, next: NextFunction): Promise<void>;
  driverVerifyPickup(req: Request, res: Response, next: NextFunction): Promise<void>;
  passengerConfirmPickup(req: Request, res: Response, next: NextFunction): Promise<void>;
  driverDropOffPassenger(req: Request, res: Response, next: NextFunction): Promise<void>;
  passengerConfirmDropOff(req: Request, res: Response, next: NextFunction): Promise<void>;
  passengerNoShow(req: Request, res: Response, next: NextFunction): Promise<void>;
  driverCompleteJourney(req: Request, res: Response, next: NextFunction): Promise<void>;
}
