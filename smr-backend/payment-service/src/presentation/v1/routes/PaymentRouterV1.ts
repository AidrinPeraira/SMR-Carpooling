import { IPaymentControllerV1 } from "#/presentation/v1/interfaces/IPaymentControllerV1";
import { Router } from "express";

export function createPaymentRouterV1(
  paymentController: IPaymentControllerV1,
): Router {
  const router = Router();

  router.post(
    "/booking/order",
    paymentController.createBookingPaymentOrder.bind(paymentController),
  );
  router.post(
    "/booking/verify",
    paymentController.verifyBookingPayment.bind(paymentController),
  );
  router.post(
    "/booking/wallet",
    paymentController.payBookingWithWallet.bind(paymentController),
  );

  return router;
}
