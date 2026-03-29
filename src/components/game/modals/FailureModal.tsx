"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { Difficulty } from "@/types/game";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function FailureModal() {
  const isOpen = useGameSessionStore((state) => state.isFailedOpen);
  const closeFailedModal = useGameSessionStore(
    (state) => state.closeFailedModal,
  );
  const resetSession = useGameSessionStore((state) => state.resetSession);

  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );
  const commandStats = useGameSessionStore((state) => state.commandStats);
  const timeLimitMs = useGameSessionStore((state) => state.timeLimitMs);

  const handleRetry = useCallback(() => {
    resetSession();
    closeFailedModal();
    window.location.reload();
  }, [resetSession, closeFailedModal]);

  const handleClose = useCallback(() => {
    closeFailedModal();
  }, [closeFailedModal]);

  const accuracyLabel = useMemo(() => {
    if (commandStats.total === 0) return "—";
    return `${Math.round((commandStats.success / commandStats.total) * 100)}%`;
  }, [commandStats]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFailedModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeFailedModal]);

  if (!isOpen) return null;

  const headingId = "failure-modal-heading";
  const descriptionId = "failure-modal-description";

  return (
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-slate-950/90 p-8 shadow-[0_25px_120px_rgba(0,0,0,0.45)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-400/80">
          Caso fallido
        </p>
        <h2 id={headingId} className="mt-2 text-3xl font-bold text-white">
          Tiempo agotado
        </h2>
        <p id={descriptionId} className="mt-3 text-sm text-white/80">
          No lograste contener el incidente dentro del tiempo asignado. El caso
          se ha cerrado automáticamente y el terminal quedó bloqueado.
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
              Tiempo límite
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatDuration(timeLimitMs)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Precisión
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {accuracyLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Comandos ejecutados
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {commandStats.total}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full rounded-2xl border border-red-500/70 bg-red-600/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:w-auto"
          >
            Reintentar caso
          </button>
        </div>
      </div>
    </div>
  );
}
