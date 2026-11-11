import { Request, Response, NextFunction } from "express";
import { IGetShareTokenUseCase } from "#/application/interfaces/use-cases/journey/IGetShareTokenUseCase";
import { IJourneyControllerV1 } from "#/presentation/v1/http/interfaces/IJourneyControllerV1";
import { JourneySocketMapper } from "#/application/mapper/JourneySocketMapper";
import { Trace } from "#/presentation/utils/traces-decorator";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  GetShareTokenRequest,
  GetShareTokenSchema,
  zodParser,
} from "@sharemyride/shared";

export class JourneyControllerV1 implements IJourneyControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getShareTokenUseCase: IGetShareTokenUseCase,
  ) {}

  @Trace("journey-controller")
  async getShareToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;

      this._logger.info("Getting share token.", { userId });

      const validatedBody = zodParser<GetShareTokenRequest>(
        GetShareTokenSchema,
        req.body,
      );

      const dto = JourneySocketMapper.toGetShareTokenRequestDTO(
        validatedBody,
        userId,
      );

      const result = await this._getShareTokenUseCase.execute(dto);
      const response = JourneySocketMapper.toGetShareTokenResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Share token retrieved", response));
    } catch (error) {
      next(error);
    }
  }
}
