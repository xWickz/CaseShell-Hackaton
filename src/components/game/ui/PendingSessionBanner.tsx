"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Difficulty } from "@/types/game";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const STORAGE_KEY = "caseshell-session-storage";

export default function PendingSessionBanner() {
  const [pendingSession, setPendingSession] = useState<{
    difficulty: Difficulty;
  } | null>(null);

  useEffect(() => {
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (!serialized) return;

      const parsed = JSON.parse(serialized);
      const state = parsed?.state;
      const currentDifficulty = state?.currentDifficulty as
        | Difficulty
        | undefined;

      if (!currentDifficulty || !(currentDifficulty in DIFFICULTY_LABELS))
        return;

      const startTime = state.startTime as number | null;
      const knowledge = state.caseState?.knowledge ?? {};
      const progress = state.caseState?.progress ?? {};
      const completed = Boolean(progress.completed);

      const hasProgress =
        Boolean(startTime) || Object.keys(progress).length > 1;
      const hasKnowledge = Object.keys(knowledge).length > 0;

      if ((hasProgress || hasKnowledge) && !completed) {
        window.requestAnimationFrame(() => {
          setPendingSession({ difficulty: currentDifficulty });
        });
      }
    } catch (e) {
      console.warn("Session check failed", e);
    }
  }, []);

  if (!pendingSession) return null;

  return (
    <div className="w-full animate-in fade-in duration-700">
      <div className="rounded-3xl border border-zinc-500/30 bg-zinc-500/10 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-white">
            Quedaste en el caso {DIFFICULTY_LABELS[pendingSession.difficulty]}
          </p>
          <p className="text-sm text-white/70">
            Retoma tu investigación justo donde la pausaste.
          </p>
        </div>
        <Link
          href={`/game/${pendingSession.difficulty}`}
          className="inline-flex items-center justify-center rounded-2xl border border-gray-400/50 bg-gray-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-100 transition hover:bg-gray-400/30"
        >
          Continuar investigación
        </Link>
      </div>
    </div>
  );
}
