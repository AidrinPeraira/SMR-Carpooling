import express, { Router } from "express";
import { IJourneyControllerV1 } from "#/presentation/v1/interfaces/IJourneyControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createJourneyRouterV1(
  journeyController: IJourneyControllerV1,
): Router {
  const router = express.Router();

  // Driver: Start a journey for a trip
  router.post(
    "/:tripId/start",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.startJourney(req, res, next),
  );

  return router;
}
