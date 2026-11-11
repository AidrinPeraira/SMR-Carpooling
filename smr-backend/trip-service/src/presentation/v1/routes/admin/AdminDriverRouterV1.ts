import express, { Router } from "express";
import { IAdminDriverControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminDriverControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createAdminDriverRouterV1(
  adminDriverController: IAdminDriverControllerV1,
): Router {
  const router = express.Router();

  router.get(
    "/details/:driverId",
    AuthMiddleware(UserRole.ADMIN),
    (req, res, next) => adminDriverController.getDriverDetails(req, res, next),
  );

  return router;
}
