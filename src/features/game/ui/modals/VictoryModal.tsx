"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { getSession, signIn } from "next-auth/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SubmitRankingResult } from "@/app/actions/ranking";
import { submitRankingAction } from "@/app/actions/ranking";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import type { Difficulty } from "@/features/game/types/game";
import { GitHub } from "@/features/game/ui/ui/github";

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

const NEXT_DIFFICULTY_MAP: Record<Difficulty, Difficulty | null> = {
  easy: "medium",
  medium: "hard",
  hard: null,
};

const AUTO_RESET_DELAY_MS = 5000;
const AUTO_RESET_DELAY_SECONDS = Math.floor(AUTO_RESET_DELAY_MS / 1000);

type SubmissionFeedback = {
  kind: SubmitRankingResult["status"];
  currentTime: number;
  previousTime?: number;
};

type SubmissionState = {
  isSubmiting: boolean;
  submitted: boolean;
  submissionFeedback: SubmissionFeedback | null;
  resetCountdown: number | null;
};

const INITIAL_SUBMISSION_STATE: SubmissionState = {
  isSubmiting: false,
  submitted: false,
  submissionFeedback: null,
  resetCountdown: null,
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
  const { push } = useRouter();

  const isVictoryOpen = useGameSessionStore((state) => state.isVictoryOpen);
  const timeLimitMs = useGameSessionStore((state) => state.timeLimitMs);
  const timeRemainingMs = useGameSessionStore((state) => state.timeRemainingMs);
  const resetSession = useGameSessionStore((state) => state.resetSession);
  const initializeSession = useGameSessionStore(
    (state) => state.initializeSession,
  );

  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

  const [user, setUser] = useState<Session["user"] | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(
    INITIAL_SUBMISSION_STATE,
  );
  const autoResetTimeoutRef = useRef<number | null>(null);

  const { isSubmiting, submitted, submissionFeedback, resetCountdown } =
    submissionState;

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      setUser(session?.user || null);
    };
    if (isVictoryOpen) checkUser();
  }, [isVictoryOpen]);

  useEffect(() => {
    if (!isVictoryOpen) {
      setSubmissionState(INITIAL_SUBMISSION_STATE);
      if (autoResetTimeoutRef.current !== null) {
        window.clearTimeout(autoResetTimeoutRef.current);
        autoResetTimeoutRef.current = null;
      }
    }
  }, [isVictoryOpen]);

  useEffect(() => {
    return () => {
      if (autoResetTimeoutRef.current !== null) {
        window.clearTimeout(autoResetTimeoutRef.current);
        autoResetTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetCountdown === null || resetCountdown <= 0) return;
    const intervalId = window.setInterval(() => {
      setSubmissionState((prev) => {
        if (prev.resetCountdown === null) return prev;
        return {
          ...prev,
          resetCountdown: Math.max(0, prev.resetCountdown - 1),
        };
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [resetCountdown]);

  const elapsedSeconds = useMemo(() => {
    if (!Number.isFinite(timeLimitMs) || !Number.isFinite(timeRemainingMs)) {
      return 0;
    }

    const elapsedMs = Math.max(0, timeLimitMs - timeRemainingMs);
    return Math.floor(elapsedMs / 1000);
  }, [timeLimitMs, timeRemainingMs]);

  const caseId = CASE_IDS[currentDifficulty];
  const difficultyLabel = DIFFICULTY_LABELS[currentDifficulty];
  const nextDifficulty = NEXT_DIFFICULTY_MAP[currentDifficulty];
  const nextDifficultyLabel = nextDifficulty
    ? DIFFICULTY_LABELS[nextDifficulty]
    : null;

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
    await signIn("github", {
      callbackUrl: `${window.location.origin}/ranking`,
    });
  };

  const submitScore = async () => {
    if (!user || submitted || elapsedSeconds <= 0 || !isVictoryOpen) return;

    setSubmissionState((prev) => ({
      ...prev,
      isSubmiting: true,
      submissionFeedback: null,
    }));

    try {
      const result = await submitRankingAction(
        currentDifficulty,
        elapsedSeconds,
      );

      setSubmissionState((prev) => ({
        ...prev,
        submissionFeedback: {
          kind: result.status,
          currentTime: result.currentTime,
          previousTime: result.previousTime,
        },
      }));

      if (result.status === "slower") {
        return;
      }

      setSubmissionState((prev) => ({
        ...prev,
        submitted: true,
        resetCountdown: AUTO_RESET_DELAY_SECONDS,
      }));

      if (autoResetTimeoutRef.current !== null) {
        window.clearTimeout(autoResetTimeoutRef.current);
      }

      const timeoutId = window.setTimeout(() => {
        resetSession();
        setSubmissionState((prev) => ({
          ...prev,
          resetCountdown: null,
        }));
        autoResetTimeoutRef.current = null;
      }, AUTO_RESET_DELAY_MS);

      autoResetTimeoutRef.current = timeoutId;
    } catch (error) {
      console.error("Error al guardar ranking", error);
    } finally {
      setSubmissionState((prev) => ({
        ...prev,
        isSubmiting: false,
      }));
    }
  };

  const handleNextLevel = () => {
    if (!nextDifficulty) return;

    if (autoResetTimeoutRef.current !== null) {
      window.clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }

    setSubmissionState((prev) => ({
      ...prev,
      resetCountdown: null,
    }));
    initializeSession(nextDifficulty);
    push(`/game/${nextDifficulty}`);
  };

  const handleExploreRanking = () => {
    if (autoResetTimeoutRef.current !== null) {
      window.clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }

    setSubmissionState((prev) => ({
      ...prev,
      resetCountdown: null,
    }));
    push("/ranking");
  };

  if (!isVictoryOpen) return null;

  return (
    <VictoryModalLayout headingId={headingId}>
      <VictoryHeader
        caseId={caseId}
        difficultyLabel={difficultyLabel}
        elapsedSeconds={elapsedSeconds}
      />

      <RankingSection
        user={user}
        isSubmitting={isSubmiting}
        submitted={submitted}
        submissionMessage={submissionMessage}
        resetCountdown={resetCountdown}
        onLogin={handleLogin}
        onSubmit={submitScore}
      />

      <VictoryActions
        nextDifficultyLabel={nextDifficultyLabel}
        onReset={resetSession}
        onNext={handleNextLevel}
        onExploreRanking={handleExploreRanking}
      />
    </VictoryModalLayout>
  );
}

function VictoryModalLayout({
  headingId,
  children,
}: {
  headingId: string;
  children: ReactNode;
}) {
  return (
    <div
      className="font-sans fixed inset-0 z-999 overflow-y-auto bg-zinc-950/70 px-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center">
        <div className="w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-500/30 bg-zinc-900/95 p-8 shadow-[0_25px_120px_rgba(16,185,129,0.18)]">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Caso Resuelto
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function VictoryHeader({
  caseId,
  difficultyLabel,
  elapsedSeconds,
}: {
  caseId: string;
  difficultyLabel: string;
  elapsedSeconds: number;
}) {
  return (
    <>
      <p className="mt-3 text-zinc-300">
        Has restaurado los servicios del caso{" "}
        <span className="font-semibold text-emerald-400">{caseId}</span> en
        dificultad <span className="font-semibold">{difficultyLabel}</span>.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Tiempo total
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatTime(elapsedSeconds)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Dificultad
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {difficultyLabel}
          </p>
        </div>
      </div>
    </>
  );
}

function RankingSection({
  user,
  isSubmitting,
  submitted,
  submissionMessage,
  resetCountdown,
  onLogin,
  onSubmit,
}: {
  user: Session["user"] | null;
  isSubmitting: boolean;
  submitted: boolean;
  submissionMessage: string | null;
  resetCountdown: number | null;
  onLogin: () => Promise<void>;
  onSubmit: () => Promise<void>;
}) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-900/10 p-5 text-center">
      {!user ? (
        <>
          <p className="text-sm font-semibold text-blue-200">
            ¿Quieres entrar en la clasificación?
          </p>
          <p className="mb-2 text-xs text-blue-300/70">
            Ingresa para guardar tu mejor récord global de la hackathon.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="flex items-center gap-2 rounded-xl bg-[#24292e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f363d]"
          >
            <GitHub className="size-5" />
            Iniciar sesión con GitHub
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-blue-200">
            Conectado como <span className="text-white">{user.name}</span>
          </p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || submitted}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              submitted
                ? "cursor-not-allowed bg-emerald-500/50"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting
              ? "Guardando..."
              : submitted
                ? "¡Récord Guardado!"
                : "Publicar mi tiempo"}
          </button>
          {submissionMessage ? (
            <p className="max-w-sm text-xs text-blue-200/80">
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
              className="mt-1 text-xs text-blue-300 underline hover:text-white"
            >
              Ver tabla de clasificaciones
            </Link>
          )}
        </>
      )}
    </div>
  );
}

function VictoryActions({
  nextDifficultyLabel,
  onReset,
  onNext,
  onExploreRanking,
}: {
  nextDifficultyLabel: string | null;
  onReset: () => void;
  onNext: () => void;
  onExploreRanking: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
      >
        Volver a jugar
      </button>

      {nextDifficultyLabel ? (
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400"
        >
          Siguiente nivel: {nextDifficultyLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={onExploreRanking}
          className="rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400"
        >
          Explora ranking
        </button>
      )}

      <Link
        href="/game"
        className="rounded-xl border border-zinc-600 px-5 py-3 text-center font-semibold text-zinc-200 transition hover:bg-zinc-800"
      >
        Menú principal
      </Link>

      <Link
        href="/ranking"
        className="rounded-xl border border-zinc-600 px-5 py-3 text-center font-semibold text-zinc-200 transition hover:bg-zinc-800"
      >
        Ver ranking
      </Link>
    </div>
  );
}
