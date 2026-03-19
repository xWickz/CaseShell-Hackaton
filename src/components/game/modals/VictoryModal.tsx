"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { Difficulty } from "@/types/game";
import { getChecklistForDifficulty } from "@/data/game/checklist";

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
  const commandLog = useGameSessionStore((state) => state.commandLog);

  const caseState = useGameSessionStore((state) => state.caseState);
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

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

  const sharePayload = useMemo(() => {
    const commandSummary = commandLog
      .map((entry) => `• ${entry.command} (${entry.outcome})`)
      .join("\n");

    return `CaseShell - ${caseId} (${difficultyLabel})\nTiempo: ${formatTime(elapsedSeconds)}\nComandos ejecutados:\n${commandSummary}`;
  }, [caseId, difficultyLabel, elapsedSeconds, commandLog]);

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "CaseShell — Replay", text: sharePayload });
      } else {
        await navigator.clipboard.writeText(sharePayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed", error);
    }
  };

  if (!isVictoryOpen) return null;

  return (
    <div
      className="absolute inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="w-full max-w-xl rounded-3xl border border-emerald-500/20 bg-slate-900/95 p-8 shadow-2xl shadow-emerald-500/10 max-h-[calc(100vh-40px)] overflow-y-auto">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Mission Complete
        </div>

        {/* Title */}
        <h2 id={headingId} className="text-3xl font-bold text-white sm:text-4xl">
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
            <p className="mt-2 text-2xl font-bold text-emerald-400">{difficultyLabel}</p>
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
                <span className={item.done ? "text-emerald-400" : "text-slate-500"}>
                  {item.done ? "✓" : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Replay del caso</p>
              <p className="text-xs text-slate-400">
                {commandLog.length} comandos registrados
              </p>
            </div>
            <button
              onClick={handleShare}
              className="mt-3 inline-flex items-center justify-center rounded-xl border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
            >
              {copied ? "Copiado" : "Compartir"}
            </button>
          </div>

          <div className="mt-4 max-h-48 overflow-y-auto rounded-xl border border-white/5 bg-black/30 p-3 text-xs font-mono text-slate-200">
            {commandLog.length === 0 ? (
              <p className="text-slate-500">Aún no hay comandos registrados.</p>
            ) : (
              <ol className="space-y-1">
                {commandLog.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3"
                    aria-label={`${entry.command} ${entry.outcome}`}
                  >
                    <span className="truncate">{entry.command}</span>
                    <span
                      className={
                        entry.outcome === "error"
                          ? "text-red-400"
                          : "text-emerald-300"
                      }
                    >
                      {entry.outcome}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
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
