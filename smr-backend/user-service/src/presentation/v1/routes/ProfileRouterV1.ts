import { IProfileControllerV1 } from "#/presentation/v1/interfaces/IProfileControllerV1";
import { Router } from "express";

/**
 * Initializes and returns an express router that routes incoming profile requests to V1 profile controller.
 *
 * @param profileControllerV1 : Instance of profile controller for API version v1
 * @returns express router object.
 */
export function createProfileRouterV1(
  profileControllerV1: IProfileControllerV1,
): Router {
  const router = Router();

  router.get("/", profileControllerV1.getUser.bind(profileControllerV1));

  return router;
}
