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

  // Driver: Get journey details
  router.get(
    "/:journeyId/driver",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.getDriverJourneyDetails(req, res, next),
  );

  // Passenger: Get journey details
  router.get(
    "/:journeyId/passenger",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => journeyController.getPassengerJourneyDetails(req, res, next),
  );

  // Driver: Mark arrival at a stop
  router.post(
    "/driver/arrived",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.driverArrived(req, res, next),
  );

  // Driver: Verify passenger pickup OTP
  router.post(
    "/driver/verify-pickup",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.driverVerifyPickup(req, res, next),
  );

  // Passenger: Confirm pickup
  router.post(
    "/passenger/confirm-pickup",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => journeyController.passengerConfirmPickup(req, res, next),
  );

  // Driver: Drop off passenger
  router.post(
    "/driver/drop-off",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.driverDropOffPassenger(req, res, next),
  );

  // Passenger: Confirm drop off
  router.post(
    "/passenger/confirm-drop-off",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => journeyController.passengerConfirmDropOff(req, res, next),
  );

  // Driver: Mark passenger as no-show
  router.post(
    "/driver/no-show",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.passengerNoShow(req, res, next),
  );

  // Driver: Complete journey
  router.patch(
    "/:journeyId/complete",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => journeyController.driverCompleteJourney(req, res, next),
  );

  return router;
}
