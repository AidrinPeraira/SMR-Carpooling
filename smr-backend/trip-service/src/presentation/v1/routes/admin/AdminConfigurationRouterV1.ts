import { IAdminConfigurationControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminConfigurationControllerV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { UserRole } from "@sharemyride/shared";
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

  // Allow all authenticated users (ADMIN, DRIVER, PASSENGER) to fetch vehicle/pricing configurations
  router.get(
    "/",
    AuthMiddleware(UserRole.ADMIN, UserRole.DRIVER, UserRole.PASSENGER),
    adminConfigurationControllerV1.getConfigurations.bind(
      adminConfigurationControllerV1,
    ),
  );

  // Admin-only mutation routes
  router.post(
    "/pricing",
    AuthMiddleware(UserRole.ADMIN),
    adminConfigurationControllerV1.createPricing.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.patch(
    "/pricing/:id",
    AuthMiddleware(UserRole.ADMIN),
    adminConfigurationControllerV1.updatePricing.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.post(
    "/vehicles",
    AuthMiddleware(UserRole.ADMIN),
    adminConfigurationControllerV1.createVehicle.bind(
      adminConfigurationControllerV1,
    ),
  );

  router.patch(
    "/vehicles/:id",
    AuthMiddleware(UserRole.ADMIN),
    adminConfigurationControllerV1.updateVehicle.bind(
      adminConfigurationControllerV1,
    ),
  );

  return router;
}
