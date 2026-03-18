"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { Difficulty } from "@/types/game";
import type { CaseProgress } from "@/types/game-engine";

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

const CHECKLIST_CONFIG: Array<{
  key: keyof CaseProgress;
  label: string;
  difficulties: Difficulty[];
}> = [
  { key: "wifiFixed", label: "WiFi restaurado", difficulties: ["easy", "medium", "hard"] },
  { key: "firewallFixed", label: "Firewall corregido", difficulties: ["easy", "medium", "hard"] },
  { key: "malwareKilled", label: "Malware eliminado", difficulties: ["easy", "medium", "hard"] },
  { key: "dnsFixed", label: "DNS normalizado", difficulties: ["medium", "hard"] },
  { key: "servicesRestarted", label: "Servicios reiniciados", difficulties: ["medium", "hard"] },
  { key: "switchPortEnabled", label: "Puerto crítico habilitado", difficulties: ["hard"] },
];

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

  const elapsedSeconds = useMemo(() => {
    if (!startTime || !endTime) return 0;
    return Math.max(0, Math.floor((endTime - startTime) / 1000));
  }, [startTime, endTime]);

  const caseId = CASE_IDS[currentDifficulty];
  const difficultyLabel = DIFFICULTY_LABELS[currentDifficulty];

  const checklist = useMemo(() => {
    return CHECKLIST_CONFIG.filter((item) =>
      item.difficulties.includes(currentDifficulty),
    ).map((item) => ({
      label: item.label,
      done: Boolean(caseState.progress[item.key]),
    }));
  }, [currentDifficulty, caseState.progress]);

  if (!isVictoryOpen) return null;

  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-500/20 bg-slate-900/95 p-8 shadow-2xl shadow-emerald-500/10">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Mission Complete
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
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
