import express, { Router } from "express";
import { IBookingControllerV1 } from "#/presentation/v1/interfaces/IBookingControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createBookingRouterV1(
  bookingController: IBookingControllerV1,
): Router {
  const router = express.Router();

  // Create a new booking (Passenger only)
  router.post(
    "/",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => bookingController.createBooking(req, res, next),
  );

  return router;
}
