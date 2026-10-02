import { Request, Response, NextFunction } from "express";

export interface IChatControllerV1 {
  syncChatMessages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
