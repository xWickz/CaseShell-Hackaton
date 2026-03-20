"use client";

import { ReactNode, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { submitRankingAction } from "@/app/actions/ranking";

function PendingScoreSyncInner() {
  const { data: session } = useSession();

  useEffect(() => {
    async function pushIfPending() {
      if (!session?.user) return;
      const pending = localStorage.getItem("pendingScore");
      if (!pending) return;

      const payload = JSON.parse(pending);
      try {
        await submitRankingAction(payload.difficulty, payload.timeElapsed);
      } catch (error) {
        console.error("Error syncing pending score", error);
      } finally {
        localStorage.removeItem("pendingScore");
      }
    }

    pushIfPending();
  }, [session?.user]);

  return null;
}

export function PendingScoreSync({ children }: { children?: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <PendingScoreSyncInner />
    </SessionProvider>
  );
}
