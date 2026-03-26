"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGameUIStore } from "@/store/useGameUIStore";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { Difficulty } from "@/types/game";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const formatElapsed = (startTime: number | null, reference: number) => {
  if (!startTime) return "—";
  const elapsedSeconds = Math.max(
    0,
    Math.floor((reference - startTime) / 1000),
  );
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

export default function ExitModal() {
  const isOpen = useGameUIStore((state) => state.exitModalOpen);
  const closeModal = useGameUIStore((state) => state.closeExitModal);
  const [now, setNow] = useState(() => Date.now());

  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );
  const startTime = useGameSessionStore((state) => state.startTime);
  const commandStats = useGameSessionStore((state) => state.commandStats);

  const router = useRouter();

  const handleExit = useCallback(() => {
    closeModal();
    router.push("/game");
  }, [closeModal, router]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const accuracyLabel = useMemo(() => {
    if (commandStats.total === 0) return "—";
    return `${Math.round((commandStats.success / commandStats.total) * 100)}%`;
  }, [commandStats]);

  useEffect(() => {
    if (!isOpen) return;
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearInterval(intervalId);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const headingId = "exit-modal-heading";
  const descriptionId = "exit-modal-description";

  return (
    <div
      className="fixed inset-0 z-1100 bg-black/70 backdrop-blur-sm px-4 py-10 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/90 p-8 shadow-[0_25px_120px_rgba(0,0,0,0.45)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/50">
          Confirmación requerida
        </p>
        <h2 id={headingId} className="mt-2 text-3xl font-bold text-white">
          ¿Salir de la operación?
        </h2>
        <p id={descriptionId} className="mt-3 text-sm text-white/80">
          El progreso del caso se guarda automáticamente. Puedes retomar desde
          el mismo punto cuando regreses al centro de mando.
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
              {formatElapsed(startTime, now)}
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
            Seguir investigando
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="w-full rounded-2xl border border-red-500/70 bg-red-600/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:w-auto"
          >
            Guardar y salir
          </button>
        </div>
      </div>
    </div>
  );
}
