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

  // Driver: List all bookings
  router.get(
    "/driver",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => bookingController.getDriverBookings(req, res, next),
  );

  // Driver: Get booking details
  router.get(
    "/driver/:bookingId",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) =>
      bookingController.getDriverBookingDetails(req, res, next),
  );

  // Driver: Accept booking
  router.patch(
    "/:bookingId/accept",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => bookingController.acceptBooking(req, res, next),
  );

  // Driver: Reject booking
  router.patch(
    "/:bookingId/reject",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => bookingController.rejectBooking(req, res, next),
  );

  // Passenger: List all bookings
  router.get(
    "/passenger",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) => bookingController.getPassengerBookings(req, res, next),
  );

  // Passenger: Get booking details
  router.get(
    "/passenger/:bookingId",
    AuthMiddleware(UserRole.PASSENGER),
    (req, res, next) =>
      bookingController.getPassengerBookingDetails(req, res, next),
  );

  return router;
}
