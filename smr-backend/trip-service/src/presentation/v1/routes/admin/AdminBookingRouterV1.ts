import express, { Router } from "express";
import { IAdminBookingControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminBookingControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createAdminBookingRouterV1(
  adminBookingController: IAdminBookingControllerV1,
): Router {
  const router = express.Router();

  router.get(
    "/all",
    AuthMiddleware(UserRole.ADMIN),
    (req, res, next) => adminBookingController.listAllBookings(req, res, next),
  );

  router.get(
    "/details/:bookingId",
    AuthMiddleware(UserRole.ADMIN),
    (req, res, next) => adminBookingController.getBookingDetails(req, res, next),
  );

  return router;
}
