import express, { Router } from "express";
import { IWebhookControllerV1 } from "#/presentation/v1/interfaces/IWebhookControllerV1";

export function createWebhookRouterV1(
  webhookController: IWebhookControllerV1,
): Router {
  const router = express.Router();

  // Cleanup booking payment callback from scheduler/QStash
  router.post("/booking-cleanup", (req, res, next) =>
    webhookController.cleanupBookingPayment(req, res, next),
  );

  // Cleanup trips indexing callback from scheduler/QStash
  router.post("/trips-cleanup", (req, res, next) =>
    webhookController.cleanupTrips(req, res, next),
  );

  return router;
}
