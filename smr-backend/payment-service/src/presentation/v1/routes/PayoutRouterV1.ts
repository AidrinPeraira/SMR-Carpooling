import { IPayoutControllerV1 } from "#/presentation/v1/interfaces/IPayoutControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";
import { Router } from "express";

export function createPayoutRouterV1(
  payoutController: IPayoutControllerV1,
): Router {
  const router = Router();

  router.get(
    "/driver",
    AuthMiddleware(UserRole.DRIVER),
    (req, res, next) => payoutController.getDriverPayouts(req, res, next),
  );

  router.get(
    "/admin",
    AuthMiddleware(UserRole.ADMIN),
    (req, res) => payoutController.adminListPayouts(req, res),
  );

  router.get(
    "/admin/:payoutId",
    AuthMiddleware(UserRole.ADMIN),
    (req, res) => payoutController.adminGetPayoutDetails(req, res),
  );

  router.patch(
    "/admin/:payoutId/approve",
    AuthMiddleware(UserRole.ADMIN),
    (req, res) => payoutController.adminApprovePayout(req, res),
  );

  return router;
}
