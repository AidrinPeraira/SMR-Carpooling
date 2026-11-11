import { IApplicationControllerV1 } from "#/presentation/v1/interfaces/IApplicationControllerV1";
import { Router } from "express";

/**
 * Initializes and returns an express router that routes application requests to V1 application controller.
 *
 * @param applicationControllerV1 : Instance of application controller for API version v1
 * @returns express router object.
 */
export function createApplicationRouterV1(
  applicationControllerV1: IApplicationControllerV1,
): Router {
  const router = Router();

  router.post(
    "/upload-url",
    applicationControllerV1.getFileUploadUrl.bind(applicationControllerV1),
  );

  router.post(
    "/onboarding",
    applicationControllerV1.onboardingApplication.bind(applicationControllerV1),
  );
  router.post(
    "/vehicle",
    applicationControllerV1.newVehicleApplication.bind(applicationControllerV1),
  );
  router.post(
    "/renew/driver",
    applicationControllerV1.renewDriverApplication.bind(applicationControllerV1),
  );
  router.post(
    "/renew/vehicle",
    applicationControllerV1.renewVehicleApplication.bind(applicationControllerV1),
  );

  router.patch(
    "/resubmit/onboarding/:applicationId",
    applicationControllerV1.resubmitOnboardingApplication.bind(
      applicationControllerV1,
    ),
  );
  router.patch(
    "/resubmit/vehicle/:applicationId",
    applicationControllerV1.resubmitNewVehicleApplication.bind(
      applicationControllerV1,
    ),
  );
  router.patch(
    "/resubmit/renew/driver/:applicationId",
    applicationControllerV1.resubmitRenewDriverApplication.bind(
      applicationControllerV1,
    ),
  );
  router.patch(
    "/resubmit/renew/vehicle/:applicationId",
    applicationControllerV1.resubmitRenewVehicleApplication.bind(
      applicationControllerV1,
    ),
  );

  router.get(
    "/",
    applicationControllerV1.getApplications.bind(applicationControllerV1),
  );
  router.get(
    "/:applicationId",
    applicationControllerV1.getApplicationDetails.bind(applicationControllerV1),
  );

  return router;
}
