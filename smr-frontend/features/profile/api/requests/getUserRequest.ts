import { GetUserResult } from "@smr/shared";

export async function getUserRequest(): Promise<GetUserResult> {
  const response = await fetch("/api/v1/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error();
  }

  const result = await response.json();
  return result.payload as GetUserResult;
}
