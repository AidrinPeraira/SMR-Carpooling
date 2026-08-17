import express, { Router } from "express";
import { IAdminTripControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminTripControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createAdminTripRouterV1(
  adminTripController: IAdminTripControllerV1,
): Router {
  const router = express.Router();

  router.get(
    "/all",
    AuthMiddleware(UserRole.ADMIN),
    (req, res, next) => adminTripController.listAllTrips(req, res, next),
  );

  router.get(
    "/details/:tripId",
    AuthMiddleware(UserRole.ADMIN),
    (req, res, next) => adminTripController.getTripDetails(req, res, next),
  );

  return router;
}
