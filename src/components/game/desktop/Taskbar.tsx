"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { House, Palette } from "lucide-react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useGameUIStore } from "@/store/useGameUIStore";
import { getChecklistProgress } from "@/data/game/checklist";

export default function Taskbar() {
  const [now, setNow] = useState(() => new Date());
  const caseState = useGameSessionStore((state) => state.caseState);
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );
  const commandStats = useGameSessionStore((state) => state.commandStats);
  const startTime = useGameSessionStore((state) => state.startTime);
  const cycleWallpaperTheme = useGameUIStore((state) => state.cycleWallpaperTheme);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { timeLabel, dateLabel, elapsedSeconds } = useMemo(() => {
    const timeLabel = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateLabel = now.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const elapsedSeconds = startTime
      ? Math.max(0, Math.floor((now.getTime() - startTime) / 1000))
      : 0;

    return { timeLabel, dateLabel, elapsedSeconds };
  }, [now, startTime]);

  const progressStats = useMemo(() => {
    return getChecklistProgress(currentDifficulty, caseState.progress);
  }, [caseState.progress, currentDifficulty]);

  const accuracyPercent = useMemo(() => {
    if (commandStats.total === 0) return null;
    return Math.round((commandStats.success / commandStats.total) * 100);
  }, [commandStats]);

  const formatElapsed = () => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[999] flex items-center justify-between gap-6 border-t border-white/10 bg-black/40 px-6 py-3 text-white backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          aria-label="Ir al escritorio principal"
          className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <House className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={cycleWallpaperTheme}
          aria-label="Cambiar fondo del escritorio"
          className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Palette className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3 text-xs text-white/80">
        <span className="hidden text-[0.7rem] uppercase tracking-[0.2em] text-white/50 sm:inline">
          CaseShell OS
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge label="Incidentes" value={`${progressStats.completed}/${progressStats.total}`} />
          <Badge label="Tiempo" value={formatElapsed()} />
          <Badge
            label="Precisión"
            value={accuracyPercent === null ? "—" : `${accuracyPercent}%`}
            tone={accuracyPercent !== null && accuracyPercent < 50 ? "warning" : "default"}
          />
        </div>
      </div>

      <div className="flex flex-col text-right text-xs">
        <span className="font-semibold">{timeLabel}</span>
        <span className="text-[0.65rem] uppercase tracking-wide text-white/70">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}

type BadgeProps = {
  label: string;
  value: string;
  tone?: "default" | "warning";
};

function Badge({ label, value, tone = "default" }: BadgeProps) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
      : "border-white/15 bg-white/5 text-white";

  return (
    <div className={`rounded-xl border px-3 py-1 text-[0.65rem] ${toneClasses}`}>
      <span className="uppercase tracking-wider text-white/60">{label}</span>
      <span className="ml-2 font-semibold text-white">{value}</span>
    </div>
  );
}
