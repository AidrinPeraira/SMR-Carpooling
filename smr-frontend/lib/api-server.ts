export function apiServerFetch(urlPath: string, options?: RequestInit) {
  const headers = new Headers({
    "Content-type": "application/json",
    ...options?.headers,
  });
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${urlPath}`, {
    ...options,
    headers,
  });
}
