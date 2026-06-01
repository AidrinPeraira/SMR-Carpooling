import { ZodType } from "zod";
import { GenericErrorMessage, HttpStatusCodes } from "../enums";
import { ApplicationError, ErrorCode, ErrorDetails } from "../errors";

/**
 * This function validates data given to it using zod.
 * If the data is valid it returns the validated object.
 * If not it throws a validation error wrapped to the domain style.
 *
 * @param schema : Zod schema for the data to be parsed
 * @param payload : the data
 * @return : Parsed object or throws an error.
 */
export function zodParser<T>(
  schema: ZodType<T, any, any>,
  payload: unknown,
): T {
  const result = schema.safeParse(payload);

  if (result.success) {
    return result.data;
  }
  //if errors
  const issues = result.error.issues.map((err) => {
    return {
      field: err.path.join("."),
      message: err.message,
    };
  });

  throw new ApplicationError(
    GenericErrorMessage.VALIDATION_ERROR,
    HttpStatusCodes.BadRequest,
    ErrorCode.INPUT_VALIDATION_ERROR,
    ErrorDetails.INPUT_VALIDATION_ERROR,
    issues,
  );
}
