"use client";

import { SessionProvider } from "next-auth/react";

export function AppSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
