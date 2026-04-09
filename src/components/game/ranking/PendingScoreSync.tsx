"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function PendingScoreSync({ children }: { children?: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
