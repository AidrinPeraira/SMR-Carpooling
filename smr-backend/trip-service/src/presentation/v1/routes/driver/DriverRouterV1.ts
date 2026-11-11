import express, { Router } from "express";
import { IDriverControllerV1 } from "#/presentation/v1/interfaces/IDriverControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createDriverRouterV1(
  driverController: IDriverControllerV1,
): Router {
  const router = express.Router();

  router.get(
    "/details",
    AuthMiddleware(UserRole.DRIVER, UserRole.ADMIN),
    (req, res, next) => driverController.getDriverDetails(req, res, next),
  );

  router.get(
    "/stats",
    AuthMiddleware(UserRole.DRIVER, UserRole.ADMIN),
    (req, res, next) => driverController.getDriverTripStats(req, res, next),
  );

  return router;
}
