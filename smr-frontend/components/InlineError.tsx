/**
 * This is a reusable inline error element that is used
 * to show error message when the request response is successfuly fetched but the
 * response data status is failed
 */
export function InlineError({ message }: { message: string }) {
  return <div>{message}</div>;
}
