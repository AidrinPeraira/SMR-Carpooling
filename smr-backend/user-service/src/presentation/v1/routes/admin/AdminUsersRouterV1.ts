import { IAdminUserControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminUserControllerV1";
import { Router } from "express";

/**
 * Initializes and returns an express router that routes incoming admin requests for user data to V1 controller.
 *
 * @param profileControllerV1 : Instance of profile controller for API version v1
 * @returns express router object.
 */
export function createAdminUsersRouteV1(
  adminUserControllerV1: IAdminUserControllerV1,
): Router {
  const router = Router();

  router.get(
    "/",
    adminUserControllerV1.getAllUsers.bind(adminUserControllerV1),
  );

  router.get(
    "/:userId",
    adminUserControllerV1.getFullUserProfile.bind(adminUserControllerV1),
  );

  router.patch(
    "/block/:id",
    adminUserControllerV1.blockUser.bind(adminUserControllerV1),
  );

  router.patch(
    "/unblock/:id",
    adminUserControllerV1.unBlockUser.bind(adminUserControllerV1),
  );

  return router;
}
