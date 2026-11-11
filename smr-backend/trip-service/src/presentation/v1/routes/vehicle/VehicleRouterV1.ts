import express, { Router } from "express";
import { IVehicleControllerV1 } from "#/presentation/v1/interfaces/IVehicleControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";

export function createVehicleRouterV1(
  vehicleController: IVehicleControllerV1,
): Router {
  const router = express.Router();

  router.get(
    "/",
    AuthMiddleware(),
    (req, res, next) => vehicleController.getDriverVehicles(req, res, next),
  );

  return router;
}
