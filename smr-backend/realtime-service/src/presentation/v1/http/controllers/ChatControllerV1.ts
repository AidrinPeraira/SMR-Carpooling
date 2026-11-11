import { Request, Response, NextFunction } from "express";
import { ISyncMessagesUseCase } from "#/application/interfaces/use-cases/chat-message/ISyncMessagesUseCase";
import { IChatControllerV1 } from "#/presentation/v1/http/interfaces/IChatControllerV1";
import { ChatSocketMapper } from "#/application/mapper/ChatSocketMapper";
import { Trace } from "#/presentation/utils/traces-decorator";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  SyncChatMessagesRequest,
  SyncChatMessagesSchema,
  zodParser,
} from "@sharemyride/shared";

export class ChatControllerV1 implements IChatControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _syncMessagesUseCase: ISyncMessagesUseCase,
  ) {}

  @Trace("chat-controller")
  async syncChatMessages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;

      this._logger.info("Getting chat messages.", { userId });

      console.log("-----", req.body);

      const validatedBody = zodParser<SyncChatMessagesRequest>(
        SyncChatMessagesSchema,
        req.body,
      );

      const dto = ChatSocketMapper.toSyncChatMessagesRequestDTO(
        validatedBody,
        userId,
      );

      const result = await this._syncMessagesUseCase.execute(dto);
      const response = ChatSocketMapper.toSyncChatMessagesResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Chat messages retrieved", response));
    } catch (error) {
      next(error);
    }
  }
}
