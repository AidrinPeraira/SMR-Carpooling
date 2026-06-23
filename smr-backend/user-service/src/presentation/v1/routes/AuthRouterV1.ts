import { IAuthControllerV1 } from "#/presentation/v1/interfaces/IAuthControllerV1";
import { Router } from "express";

/**
 * This function initalises and returns an express router that routes incoming auth requests to the V1 auth controller.
 *
 * @param authControllerV1 : Instance of auth controller for API version v1
 * @returns express router object.
 */
export function createAuthRouterV1(
  authControllerV1: IAuthControllerV1,
): Router {
  const router = Router();

  router.post("/signup", authControllerV1.signup.bind(authControllerV1));

  router.post(
    "/verify-email",
    authControllerV1.verifySignupEmail.bind(authControllerV1),
  );

  router.post("/login", authControllerV1.login.bind(authControllerV1));

  router.post("/google", authControllerV1.googleAuth.bind(authControllerV1));

  return router;
}
