"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { Difficulty } from "@/types/game";
import { getChecklistForDifficulty } from "@/data/game/checklist";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { GitHub } from "@/components/game/ui/github";

const CASE_IDS: Record<Difficulty, string> = {
  easy: "EASY-001",
  medium: "MED-002",
  hard: "HARD-003",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins <= 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
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

  const [user, setUser] = useState<User | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    if (isVictoryOpen) checkUser();
  }, [isVictoryOpen]);

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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/ranking", // O redireccionar de vuelta al juego
      },
    });
  };

  const submitScore = async () => {
    if (!user || submitted) return;
    setIsSubmiting(true);
    try {
      const { error } = await supabase.from("rankings").insert([
        {
          user_name:
            user?.user_metadata?.user_name ||
            user?.user_metadata?.full_name ||
            "Hacker",
          avatar_url: user?.user_metadata?.avatar_url,
          difficulty: currentDifficulty,
          time_seconds: elapsedSeconds,
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Error guardando puntuación:", err);
      alert("Hubo un error al guardar tu puntuación. Intenta de nuevo.");
    } finally {
      setIsSubmiting(false);
    }
  };

  if (!isVictoryOpen) return null;

  return (
    <div
      className="absolute inset-0 z-999 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="w-full max-w-7xl max-h-7xl rounded-3xl border border-emerald-500/20 bg-slate-900/95 p-8 shadow-2xl shadow-emerald-500/10 h-150 overflow-y-auto">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Mission Complete
        </div>

        {/* Title */}
        <h2
          id={headingId}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          🎉 Caso Resuelto
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

        {/* Summary */}
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
        </div>

        {/* Auth / Ranking Section */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-blue-500/20 bg-blue-900/10 p-5 items-center justify-center text-center">
          {!user ? (
            <>
              <p className="text-sm font-semibold text-blue-200">
                ¿Quieres entrar al Salón de la Fama?
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
                Conectado como{" "}
                <span className="text-white">
                  {user.user_metadata?.user_name}
                </span>
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
            href="/play"
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
  );
}
