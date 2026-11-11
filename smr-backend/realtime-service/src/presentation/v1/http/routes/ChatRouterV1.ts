import express, { Router } from "express";
import { IChatControllerV1 } from "#/presentation/v1/http/interfaces/IChatControllerV1";

export function createChatRouterV1(
  chatController: IChatControllerV1,
): Router {
  const router = express.Router();

  router.post(
    "/messages",
    (req, res, next) => chatController.syncChatMessages(req, res, next),
  );

  return router;
}
