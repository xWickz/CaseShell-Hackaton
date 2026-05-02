"use client";

import { useEffect } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";

export default function GameTimerController() {
  const startTime = useGameSessionStore((state) => state.startTime);
  const timerEndsAt = useGameSessionStore((state) => state.timerEndsAt);
  const isVictoryOpen = useGameSessionStore((state) => state.isVictoryOpen);
  const hasTimedOut = useGameSessionStore((state) => state.hasTimedOut);
  const isCompleted = useGameSessionStore(
    (state) => state.caseState.progress.completed,
  );
  const isPaused = useGameSessionStore((state) => state.isPaused);
  const failureState = useGameSessionStore((state) => state.failureState);

  const updateTimeRemaining = useGameSessionStore(
    (state) => state.updateTimeRemaining,
  );
  const pauseSession = useGameSessionStore((state) => state.pauseSession);
  const resumeSession = useGameSessionStore((state) => state.resumeSession);

  useEffect(() => {
    if (
      !startTime ||
      !timerEndsAt ||
      isCompleted ||
      isVictoryOpen ||
      hasTimedOut ||
      isPaused ||
      failureState.isLockedOut
    ) {
      return;
    }

    updateTimeRemaining(Date.now());

    const intervalId = window.setInterval(() => {
      updateTimeRemaining(Date.now());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    startTime,
    timerEndsAt,
    isCompleted,
    isVictoryOpen,
    hasTimedOut,
    isPaused,
    failureState.isLockedOut,
    updateTimeRemaining,
  ]);

  useEffect(() => {
    const syncVisibilityState = () => {
      if (document.visibilityState === "hidden") {
        pauseSession();
      } else {
        resumeSession();
      }
    };

    // Sincroniza inmediatamente al montar
    syncVisibilityState();

    document.addEventListener("visibilitychange", syncVisibilityState);

    return () => {
      document.removeEventListener("visibilitychange", syncVisibilityState);
    };
  }, [pauseSession, resumeSession]);

  return null;
}
