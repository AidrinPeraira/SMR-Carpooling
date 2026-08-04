import express, { Router } from "express";
import { IAdminVehicleControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminVehicleControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";

export function createAdminVehicleRouterV1(
  adminVehicleController: IAdminVehicleControllerV1,
): Router {
  const router = express.Router();

  router.get(
    "/:driverId",
    AuthMiddleware(UserRole.ADMIN),
    (req, res, next) => adminVehicleController.getDriverVehicles(req, res, next),
  );

  return router;
}
