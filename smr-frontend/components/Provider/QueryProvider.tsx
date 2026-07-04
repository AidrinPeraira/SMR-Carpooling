"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: ReactNode;
}

/**
 * This function creates a tanstack query provider instance in the client side
 * since we wrap the provider in the root layout file creating an instance in
 * that file itself creates an instance in the server. and not the client browser.
 * since root layout is a ssr page
 *
 * So we create a clinet provider wrapper and the use that
 */
export default function QueryProvider({ children }: Props) {
  //WE USE The use state hook to prevent creating a new object on every refresh
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000 * 60,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
