export async function getAccessToken(): Promise<string> {
  const response = await fetch("/api/token", { method: "GET" });
  const result = await response.json();

  if (!result.success) {
    return "";
  }

  return result.payload.token;
}
