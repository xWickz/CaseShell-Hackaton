"use client";

import { useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";

export default function GameTimerController() {
  const startTime = useGameSessionStore((state) => state.startTime);
  const timerEndsAt = useGameSessionStore((state) => state.timerEndsAt);
  const isVictoryOpen = useGameSessionStore((state) => state.isVictoryOpen);
  const hasTimedOut = useGameSessionStore((state) => state.hasTimedOut);
  const isCompleted = useGameSessionStore(
    (state) => state.caseState.progress.completed,
  );
  const isPaused = useGameSessionStore((state) => state.isPaused);

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
      isPaused
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
    updateTimeRemaining,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseSession();
      } else {
        resumeSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseSession, resumeSession]);

  return null;
}
