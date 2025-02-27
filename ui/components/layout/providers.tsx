"use client";
import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ThemeProvider } from "../ui/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  // redirect to login page if session is not available
  const queryClient = new QueryClient();
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider session={session}>
          <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </NuqsAdapter>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
