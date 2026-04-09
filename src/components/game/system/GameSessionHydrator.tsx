"use client";

import { useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";

export default function GameSessionHydrator() {
  const hasHydrated = useGameSessionStore((state) => state.hasHydrated);
  const rehydrateRuntimeTimer = useGameSessionStore(
    (state) => state.rehydrateRuntimeTimer,
  );

  useEffect(() => {
    if (!hasHydrated) return;
    rehydrateRuntimeTimer();
  }, [hasHydrated, rehydrateRuntimeTimer]);

  return null;
}
