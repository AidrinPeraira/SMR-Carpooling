import { IAdminApplicationControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminApplicationControllerV1";
import { Router } from "express";

/**
 * Initializes and returns an express router that routes admin application requests to V1 admin application controller.
 *
 * @param adminApplicationControllerV1 : Instance of admin application controller for API version v1
 * @returns express router object.
 */
export function createAdminApplicationRouterV1(
  adminApplicationControllerV1: IAdminApplicationControllerV1,
): Router {
  const router = Router();

  router.get(
    "/",
    adminApplicationControllerV1.getAllApplications.bind(
      adminApplicationControllerV1,
    ),
  );
  router.get(
    "/:applicationId",
    adminApplicationControllerV1.getApplicationDetails.bind(
      adminApplicationControllerV1,
    ),
  );
  router.post(
    "/process",
    adminApplicationControllerV1.processApplication.bind(
      adminApplicationControllerV1,
    ),
  );

  return router;
}
