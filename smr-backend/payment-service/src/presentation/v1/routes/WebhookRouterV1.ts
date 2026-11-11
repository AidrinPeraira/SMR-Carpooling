import { IWebhookControllerV1 } from "#/presentation/v1/interfaces/IWebhookControllerV1";
import { Router } from "express";

export function createWebhookRouterV1(
  webhookController: IWebhookControllerV1,
): Router {
  const router = Router();

  router.post(
    "/clear-booking-payment",
    webhookController.clearBookingPayment.bind(webhookController),
  );

  return router;
}
