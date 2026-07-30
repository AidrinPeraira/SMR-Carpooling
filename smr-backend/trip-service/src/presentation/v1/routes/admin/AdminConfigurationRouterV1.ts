import { IAdminConfigurationControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminConfigurationControllerV1";
import { Router } from "express";

/**
 * Initializes and returns an express router that routes incoming admin requests for trip/pricing configurations to V1 controller.
 *
 * @param adminConfigurationControllerV1 : Instance of configuration controller for API version v1
 * @returns express router object.
 */
export function createAdminConfigurationRouterV1(
  adminConfigurationControllerV1: IAdminConfigurationControllerV1,
): Router {
  const router = Router();

  router.get(
    "/",
    adminConfigurationControllerV1.getConfigurations.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.post(
    "/pricing",
    adminConfigurationControllerV1.createPricing.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.patch(
    "/pricing/:id",
    adminConfigurationControllerV1.updatePricing.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.post(
    "/vehicles",
    adminConfigurationControllerV1.createVehicle.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.patch(
    "/vehicles/:id",
    adminConfigurationControllerV1.updateVehicle.bind(
      adminConfigurationControllerV1,
    ),
  );

  return router;
}
