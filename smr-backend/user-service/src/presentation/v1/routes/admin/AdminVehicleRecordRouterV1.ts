import { IAdminVehicleRecordControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminVehicleRecordControllerV1";
import { Router } from "express";

export function createAdminVehicleRecordRouteV1(
  adminVehicleRecordControllerV1: IAdminVehicleRecordControllerV1,
): Router {
  const router = Router();

  router.get(
    "/",
    adminVehicleRecordControllerV1.getAllVehicleRecords.bind(
      adminVehicleRecordControllerV1,
    ),
  );

  router.get(
    "/:recordId",
    adminVehicleRecordControllerV1.getVehicleRecordDetails.bind(
      adminVehicleRecordControllerV1,
    ),
  );

  return router;
}
