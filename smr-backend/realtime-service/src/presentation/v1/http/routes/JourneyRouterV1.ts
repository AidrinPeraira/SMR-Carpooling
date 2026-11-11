import express, { Router } from "express";
import { IJourneyControllerV1 } from "#/presentation/v1/http/interfaces/IJourneyControllerV1";

export function createJourneyRouterV1(
  journeyController: IJourneyControllerV1,
): Router {
  const router = express.Router();

  router.post(
    "/share-token",
    (req, res, next) => journeyController.getShareToken(req, res, next),
  );

  return router;
}
