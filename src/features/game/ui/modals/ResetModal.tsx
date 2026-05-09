"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";
import type { Difficulty } from "@/features/game/types/game";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const formatElapsed = (elapsedSeconds: number) => {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

export default function ResetModal() {
  const isOpen = useGameUIStore((state) => state.resetModalOpen);
  const closeModal = useGameUIStore((state) => state.closeResetModal);
  const resetSession = useGameSessionStore((state) => state.resetSession);

  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );
  const timeLimitMs = useGameSessionStore((state) => state.timeLimitMs);
  const timeRemainingMs = useGameSessionStore((state) => state.timeRemainingMs);
  const commandStats = useGameSessionStore((state) => state.commandStats);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleReset = useCallback(() => {
    resetSession();
    closeModal();
    window.location.reload();
  }, [resetSession, closeModal]);

  const accuracyLabel = useMemo(() => {
    if (commandStats.total === 0) return "—";
    return `${Math.round((commandStats.success / commandStats.total) * 100)}%`;
  }, [commandStats]);

  const elapsedSeconds = useMemo(() => {
    if (!Number.isFinite(timeLimitMs) || !Number.isFinite(timeRemainingMs)) {
      return 0;
    }

    const elapsedMs = Math.max(0, timeLimitMs - timeRemainingMs);
    return Math.floor(elapsedMs / 1000);
  }, [timeLimitMs, timeRemainingMs]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const headingId = "reset-modal-heading";
  const descriptionId = "reset-modal-description";

  return (
    <div
      className="fixed inset-0 z-1100 bg-zinc-950/70 backdrop-blur-sm px-4 py-10 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950/90 p-8 shadow-[0_25px_120px_rgba(0,0,0,0.45)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/50">
          Reiniciar sistema
        </p>
        <h2 id={headingId} className="mt-2 text-3xl font-semibold text-white">
          ¿Restablecer el caso actual?
        </h2>
        <p id={descriptionId} className="mt-3 text-sm text-white/80">
          Se reiniciará la simulación con los parámetros de dificultad actuales.
          El historial de comandos y el progreso se limpiarán por completo.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Dificultad
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {DIFFICULTY_LABELS[currentDifficulty]}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Tiempo activo
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatElapsed(elapsedSeconds)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Precisión de comandos
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {accuracyLabel}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-2xl border border-emerald-500/70 bg-emerald-600/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:w-auto"
          >
            Reiniciar caso
          </button>
        </div>
      </div>
    </div>
  );
}
