"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Palette,
  Power,
  RotateCcw,
  ChevronUp,
  ClipboardList,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useGameUIStore } from "@/store/useGameUIStore";

export default function Taskbar() {
  const [now, setNow] = useState(() => new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const commandStats = useGameSessionStore((state) => state.commandStats);
  const startTime = useGameSessionStore((state) => state.startTime);
  const cycleWallpaperTheme = useGameUIStore(
    (state) => state.cycleWallpaperTheme,
  );
  const openObjectivePanel = useGameUIStore(
    (state) => state.openObjectivePanel,
  );
  const objectivePanelVisible = useGameUIStore(
    (state) => state.objectivePanelVisible,
  );
  const alertSoundsEnabled = useGameUIStore(
    (state) => state.alertSoundsEnabled,
  );
  const toggleAlertSounds = useGameUIStore(
    (state) => state.toggleAlertSounds,
  );
  const openExitModal = useGameUIStore((state) => state.openExitModal);
  const openResetModal = useGameUIStore((state) => state.openResetModal);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startMenuRef.current &&
        !startMenuRef.current.contains(event.target as Node)
      ) {
        setIsStartMenuOpen(false);
      }
    };

    if (isStartMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStartMenuOpen]);

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
    <div className="absolute bottom-0 left-0 right-0 z-999 flex items-center justify-between gap-6 border-t border-white/10 bg-black/40 px-6 py-3 text-white shadow-[0_-8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl">
      <div className="flex items-center gap-2 relative" ref={startMenuRef}>
        {/* Start Menu Button */}
        <button
          type="button"
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          aria-label="Abrir menú de inicio"
          className={`rounded-xl p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center gap-1 ${isStartMenuOpen ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
        >
          <ChevronUp
            className={`h-5 w-5 transition-transform ${isStartMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Start Menu Dropdown */}
        {isStartMenuOpen && (
          <div className="absolute bottom-[calc(100%+1rem)] left-0 w-64 rounded-2xl border border-white/10 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur-xl animate-scale-in">
            <div className="mb-2 px-3 py-2 border-b border-white/5">
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                Sistema
              </span>
            </div>
            <button
              onClick={toggleAlertSounds}
              className="mb-1 w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {alertSoundsEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">
                  Sonidos de virus
                </span>
                <span className="text-[0.65rem] uppercase tracking-wide text-white/50">
                  {alertSoundsEnabled ? "Activados" : "Silenciados"}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                setIsStartMenuOpen(false);
                openResetModal();
              }}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar Sistema
            </button>
            <button
              onClick={() => {
                setIsStartMenuOpen(false);
                openExitModal();
              }}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-1"
            >
              <Power className="h-4 w-4" />
              Apagar y Salir
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={cycleWallpaperTheme}
          aria-label="Cambiar fondo del escritorio"
          className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Palette className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={openObjectivePanel}
          aria-label="Mostrar panel de objetivos"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${objectivePanelVisible ? "bg-emerald-500/15 text-emerald-100" : "bg-white/10 text-white/80 hover:bg-white/20"}`}
        >
          <ClipboardList className="h-4 w-4" />
          <span className="font-semibold tracking-wide uppercase text-[0.65rem]">
            Objetivos
          </span>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3 text-xs text-white/80">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge label="Tiempo" value={formatElapsed()} />
          <Badge
            label="Precisión"
            value={accuracyPercent === null ? "—" : `${accuracyPercent}%`}
            tone={
              accuracyPercent !== null && accuracyPercent < 50
                ? "warning"
                : "default"
            }
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
    <div
      className={`rounded-xl border px-3 py-1 text-[0.65rem] ${toneClasses}`}
    >
      <span className="uppercase tracking-wider text-white/60">{label}</span>
      <span className="ml-2 font-semibold text-white">{value}</span>
    </div>
  );
}
