import { IAdminControllerV1 } from "#/presentation/v1/interfaces/IAdminControllerV1";
import { Router } from "express";

/**
 * Creates and configures the admin router for v1 of the payment service API.
 *
 * @param adminController - An implementation of IAdminControllerV1
 * @returns Configured Express Router for admin routes
 */
export function createAdminRouterV1(adminController: IAdminControllerV1): Router {
  const router = Router();

  router.get(
    "/transactions",
    adminController.listTransactions.bind(adminController),
  );

  router.get(
    "/dashboard/summary",
    adminController.getTransactionsSummary.bind(adminController),
  );

  router.get(
    "/dashboard/revenue-trend",
    adminController.getRevenueTrend.bind(adminController),
  );

  return router;
}
