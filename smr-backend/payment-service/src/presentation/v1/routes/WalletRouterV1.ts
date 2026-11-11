import { IWalletControllerV1 } from "#/presentation/v1/interfaces/IWalletControllerV1";
import { Router } from "express";

export function createWalletRouterV1(
  walletController: IWalletControllerV1,
): Router {
  const router = Router();

  router.get(
    "/transactions",
    walletController.getWalletTransactions.bind(walletController),
  );

  return router;
}
