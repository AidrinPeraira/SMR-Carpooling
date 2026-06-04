export interface ApiSuccessResponse<PayloadType = any> {
  success: true;
  message: string;
  payload?: PayloadType;
}

export interface ApiFailureResponse {
  success: false;
  message: string;
  error: {
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<successPayloadType = any> =
  | ApiSuccessResponse<successPayloadType>
  | ApiFailureResponse;

export function makeSuccessResponse<payloadType>(
  message: string,
  payload?: payloadType,
): ApiSuccessResponse<payloadType> {
  return {
    success: true,
    message: message,
    payload: payload,
  };
}

export function makeFailedResponse(
  message: string,
  code?: string,
  details?: unknown,
): ApiFailureResponse {
  return {
    success: false,
    message: message,
    error: {
      code,
      details,
    },
  };
}
