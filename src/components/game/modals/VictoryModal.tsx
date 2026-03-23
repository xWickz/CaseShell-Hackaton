"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { Difficulty } from "@/types/game";
import { getChecklistForDifficulty } from "@/data/game/checklist";
import { signIn, getSession } from "next-auth/react";
import type { Session } from "next-auth";
import { submitRankingAction } from "@/app/actions/ranking";
import type { SubmitRankingResult } from "@/app/actions/ranking";
import { GitHub } from "@/components/game/ui/github";

const CASE_IDS: Record<Difficulty, string> = {
  easy: "ACCESS-NOT-GRANTED",
  medium: "DATA-LEAK",
  hard: "CRITICAL-COLLAPSE",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const AUTO_RESET_DELAY_MS = 5000;
const AUTO_RESET_DELAY_SECONDS = Math.floor(AUTO_RESET_DELAY_MS / 1000);

type SubmissionFeedback = {
  kind: SubmitRankingResult["status"];
  currentTime: number;
  previousTime?: number;
};

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`;
  }
  if (mins <= 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDeltaLabel(deltaSeconds: number) {
  const sign = deltaSeconds >= 0 ? "+" : "-";
  const absValue = Math.abs(deltaSeconds);
  const mins = Math.floor(absValue / 60);
  const secs = absValue % 60;
  if (mins <= 0) {
    return `${sign}${secs}s`;
  }
  return `${sign}${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export default function VictoryModal() {
  const isVictoryOpen = useGameSessionStore((state) => state.isVictoryOpen);
  const startTime = useGameSessionStore((state) => state.startTime);
  const endTime = useGameSessionStore((state) => state.endTime);
  const resetSession = useGameSessionStore((state) => state.resetSession);

  const caseState = useGameSessionStore((state) => state.caseState);
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

  const [user, setUser] = useState<Session["user"] | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] =
    useState<SubmissionFeedback | null>(null);
  const [autoResetTimeoutId, setAutoResetTimeoutId] = useState<number | null>(
    null,
  );
  const [resetCountdown, setResetCountdown] = useState<number | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      setUser(session?.user || null);
    };
    if (isVictoryOpen) checkUser();
  }, [isVictoryOpen]);

  useEffect(() => {
    if (!isVictoryOpen) {
      setSubmitted(false);
      setSubmissionFeedback(null);
      setIsSubmiting(false);
      setResetCountdown(null);
      if (autoResetTimeoutId !== null) {
        window.clearTimeout(autoResetTimeoutId);
        setAutoResetTimeoutId(null);
      }
    }
  }, [isVictoryOpen, autoResetTimeoutId]);

  useEffect(() => {
    return () => {
      if (autoResetTimeoutId !== null) {
        window.clearTimeout(autoResetTimeoutId);
      }
    };
  }, [autoResetTimeoutId]);

  useEffect(() => {
    if (resetCountdown === null || resetCountdown <= 0) return;
    const intervalId = window.setInterval(() => {
      setResetCountdown((prev) => {
        if (prev === null) return null;
        return Math.max(0, prev - 1);
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [resetCountdown]);

  const elapsedSeconds = useMemo(() => {
    if (!startTime || !endTime) return 0;
    return Math.max(0, Math.floor((endTime - startTime) / 1000));
  }, [startTime, endTime]);

  const caseId = CASE_IDS[currentDifficulty];
  const difficultyLabel = DIFFICULTY_LABELS[currentDifficulty];

  const checklist = useMemo(() => {
    return getChecklistForDifficulty(currentDifficulty).map((item) => ({
      label: item.label,
      done: Boolean(caseState.progress[item.key]),
    }));
  }, [currentDifficulty, caseState.progress]);

  const headingId = "victory-heading";

  const submissionMessage = useMemo(() => {
    if (!submissionFeedback) return null;
    const { kind, previousTime, currentTime } = submissionFeedback;
    if (kind === "created") {
      return "Tiempo registrado en la clasificación. Reiniciaremos el caso automáticamente.";
    }
    if (kind === "improved" && previousTime !== undefined) {
      const delta = previousTime - currentTime;
      return `Nuevo récord: ${formatTime(currentTime)} (${formatDeltaLabel(delta)} vs ${formatTime(previousTime)}). Reiniciando el caso...`;
    }
    if (kind === "slower" && previousTime !== undefined) {
      const delta = currentTime - previousTime;
      return `Tu mejor marca es ${formatTime(previousTime)}. Esta corrida tomó ${formatTime(currentTime)} (${formatDeltaLabel(delta)} más lenta).`;
    }
    return null;
  }, [submissionFeedback]);

  const handleLogin = async () => {
    localStorage.setItem(
      "pendingScore",
      JSON.stringify({
        difficulty: currentDifficulty,
        timeElapsed: elapsedSeconds,
      }),
    );
    await signIn("github", {
      callbackUrl: window.location.origin + "/ranking",
    });
  };

  const submitScore = async () => {
    if (!user || submitted || elapsedSeconds <= 0) return;
    setIsSubmiting(true);
    setSubmissionFeedback(null);
    try {
      const result = await submitRankingAction(
        currentDifficulty,
        elapsedSeconds,
      );
      setSubmissionFeedback({
        kind: result.status,
        currentTime: result.currentTime,
        previousTime: result.previousTime,
      });

      if (result.status === "slower") {
        return;
      }

      setSubmitted(true);
      setResetCountdown(AUTO_RESET_DELAY_SECONDS);
      if (autoResetTimeoutId !== null) {
        window.clearTimeout(autoResetTimeoutId);
      }
      const timeoutId = window.setTimeout(() => {
        resetSession();
        setResetCountdown(null);
        setAutoResetTimeoutId(null);
      }, AUTO_RESET_DELAY_MS);
      setAutoResetTimeoutId(timeoutId);
    } catch (error) {
      console.error("Error al guardar ranking", error);
    } finally {
      setIsSubmiting(false);
    }
  };

  if (!isVictoryOpen) return null;

  return (
    <div
      className="font-sans fixed inset-0 z-[999] overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center">
        <div className="w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-500/30 bg-slate-900/95 p-8 shadow-[0_25px_120px_rgba(16,185,129,0.18)]">
          {/* Title */}
          <h2
            id={headingId}
            className="text-3xl font-bold text-white sm:text-4xl tracking-tight"
          >
            Caso Resuelto
          </h2>

          <p className="mt-3 text-slate-300">
            Has restaurado los servicios del caso{" "}
            <span className="font-semibold text-emerald-400">{caseId}</span> en
            dificultad <span className="font-semibold">{difficultyLabel}</span>.
          </p>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Tiempo total
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatTime(elapsedSeconds)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Dificultad
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {difficultyLabel}
              </p>
            </div>
          </div>

          {/* Summary 
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
          <p className="text-sm font-semibold text-white">
            Resumen de acciones
          </p>

          <div className="mt-4 space-y-3">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3"
              >
                <span className="text-slate-300">{item.label}</span>
                <span
                  className={item.done ? "text-emerald-400" : "text-slate-500"}
                >
                  {item.done ? "✓" : "—"}
                </span>
              </div>
            ))}
          </div>
        </div> */}

          {/* Auth / Ranking Section */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-blue-500/20 bg-blue-900/10 p-5 items-center justify-center text-center">
            {!user ? (
              <>
                <p className="text-sm font-semibold text-blue-200">
                  ¿Quieres entrar en la clasificación?
                </p>
                <p className="text-xs text-blue-300/70 mb-2">
                  Ingresa para guardar tu mejor récord global de la hackathon.
                </p>
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 rounded-xl bg-[#24292e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f363d]"
                >
                  <GitHub className="w-5 h-5" />
                  Iniciar sesión con GitHub
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-blue-200">
                  Conectado como <span className="text-white">{user.name}</span>
                </p>
                <button
                  onClick={submitScore}
                  disabled={isSubmiting || submitted}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                    submitted
                      ? "bg-emerald-500/50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {isSubmiting
                    ? "Guardando..."
                    : submitted
                      ? "¡Récord Guardado!"
                      : "Publicar mi tiempo"}
                </button>
                {submissionMessage ? (
                  <p className="text-xs text-blue-200/80 max-w-sm">
                    {submissionMessage}
                  </p>
                ) : null}
                {submitted && resetCountdown !== null ? (
                  <p className="text-[11px] text-blue-100/80">
                    Reinicio automático en {resetCountdown}s
                  </p>
                ) : null}
                {submitted && (
                  <Link
                    href="/ranking"
                    className="text-xs text-blue-300 hover:text-white underline mt-1"
                  >
                    Ver tabla de clasificaciones
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={() => {
                resetSession();
              }}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Volver a jugar
            </button>

            <Link
              href="/game"
              className="rounded-xl border border-slate-600 px-5 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Menú principal
            </Link>

            <Link
              href="/ranking"
              className="rounded-xl border border-slate-600 px-5 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Ver ranking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
