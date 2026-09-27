import express, { Router } from "express";
import { ITripControllerV1 } from "#/presentation/v1/interfaces/ITripControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createTripRouterV1(
  tripController: ITripControllerV1,
): Router {
  const router = express.Router();

  // Create a new trip (Driver only)
  router.post(
    "/",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.createTrip(req, res, next),
  );

  // Driver: List all trips
  router.get(
    "/driver",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.getDriverTrips(req, res, next),
  );

  // Driver: Get the journey the driver is currently on
  // declared before "/driver/:tripId" so it is not read as a tripId
  router.get(
    "/driver/active-journey",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.getDriverActiveJourney(req, res, next),
  );

  // Driver: Mark a journey stop as reached
  router.patch(
    "/driver/journey/arrived",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.driverArrivedAtStop(req, res, next),
  );

  // Driver: Verify a passenger pickup with the pickup OTP
  router.patch(
    "/driver/journey/pickup",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.verifyPickup(req, res, next),
  );

  // Driver: Mark a passenger as dropped off
  router.patch(
    "/driver/journey/dropoff",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.markDropOff(req, res, next),
  );

  // Driver: Complete the journey and the trip it tracks
  router.patch(
    "/driver/journey/complete",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.completeJourney(req, res, next),
  );

  // Driver: Get specific trip details
  router.get(
    "/driver/:tripId",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.getDriverTripDetails(req, res, next),
  );

  // Search/list matching trips (Passenger only)
  router.post(
    "/search",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => tripController.listMatchingTrips(req, res, next),
  );

  // Get journey details for a trip (Passenger only)
  router.post(
    "/journey-details",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => tripController.getJourneyDetails(req, res, next),
  );

  // Driver: Cancel trip
  router.patch(
    "/driver/:tripId/cancel",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.cancelTrip(req, res, next),
  );

  // Driver: Start trip
  router.patch(
    "/driver/:tripId/start",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => tripController.startTrip(req, res, next),
  );

  return router;
}
