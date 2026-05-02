"use client";

import {
  ChevronUp,
  ClipboardList,
  Monitor,
  Palette,
  Power,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";

export default function Taskbar() {
  const [now, setNow] = useState(() => new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const commandStats = useGameSessionStore((state) => state.commandStats);
  const timeLimitMs = useGameSessionStore((state) => state.timeLimitMs);
  const timeRemainingMs = useGameSessionStore((state) => state.timeRemainingMs);
  const isPaused = useGameSessionStore((state) => state.isPaused);

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
  const toggleAlertSounds = useGameUIStore((state) => state.toggleAlertSounds);
  const virusAlertTooltipOpen = useGameUIStore(
    (state) => state.virusAlertTooltipOpen,
  );
  const acknowledgeVirusAlert = useGameUIStore(
    (state) => state.acknowledgeVirusAlert,
  );
  const openExitModal = useGameUIStore((state) => state.openExitModal);
  const openResetModal = useGameUIStore((state) => state.openResetModal);
  const crtOverlayEnabled = useGameUIStore((state) => state.crtOverlayEnabled);
  const toggleCrtOverlay = useGameUIStore((state) => state.toggleCrtOverlay);

  const isStartMenuVisible = isStartMenuOpen || virusAlertTooltipOpen;

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

    if (isStartMenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStartMenuVisible]);

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

    const elapsedMs = Math.max(0, timeLimitMs - timeRemainingMs);
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    return { timeLabel, dateLabel, elapsedSeconds };
  }, [now, timeLimitMs, timeRemainingMs]);

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

  const countdownLabel = useMemo(() => {
    const totalSeconds = Math.max(0, Math.ceil(timeRemainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeRemainingMs]);

  const timeLimitTone = useMemo<"default" | "warning" | "danger">(() => {
    if (timeLimitMs <= 0) return "default";

    const ratio = timeRemainingMs / timeLimitMs;

    if (ratio <= 0.2) return "danger";
    if (ratio <= 0.5) return "warning";
    return "default";
  }, [timeRemainingMs, timeLimitMs]);

  const handleSoundButtonClick = () => {
    if (virusAlertTooltipOpen) {
      acknowledgeVirusAlert();
    }
    toggleAlertSounds();
  };

  const handleAcknowledgeTooltip = () => {
    acknowledgeVirusAlert();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-999 flex items-center justify-between gap-6 border-t border-white/10 bg-black/40 px-6 py-3 text-white shadow-[0_-8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl">
      <div className="relative flex items-center gap-2" ref={startMenuRef}>
        <button
          type="button"
          onClick={() => setIsStartMenuOpen((prev) => !prev)}
          aria-label="Abrir menú de inicio"
          className={`flex items-center gap-1 rounded-xl p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isStartMenuVisible ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <ChevronUp
            className={`h-5 w-5 transition-transform ${
              isStartMenuVisible ? "rotate-180" : ""
            }`}
          />
        </button>

        {isStartMenuVisible && (
          <div className="absolute bottom-[calc(100%+1rem)] left-0 w-64 animate-scale-in rounded-2xl border border-white/10 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur-xl">
            <div className="mb-2 border-b border-white/5 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                Sistema
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={handleSoundButtonClick}
                className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {alertSoundsEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">Sonidos de virus</span>
                  <span className="text-[0.65rem] uppercase tracking-wide text-white/50">
                    {alertSoundsEnabled ? "Activados" : "Silenciados"}
                  </span>
                </div>
              </button>

              {virusAlertTooltipOpen && (
                <div className="absolute left-[calc(100%+0.75rem)] top-0 z-20 w-64 rounded-2xl border border-cyan-400/20 bg-slate-950/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                    Consejo
                  </p>
                  <p className="mt-2 text-sm text-white/85">
                    Si te molestan los sonidos de alerta, puedes silenciarlos
                    aquí.
                  </p>
                  <button
                    type="button"
                    onClick={handleAcknowledgeTooltip}
                    className="mt-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleCrtOverlay}
              className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Monitor className="h-4 w-4" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Filtro CRT</span>
                <span className="text-[0.65rem] uppercase tracking-wide text-white/50">
                  {crtOverlayEnabled ? "Activo" : "Desactivado"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsStartMenuOpen(false);
                openResetModal();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar Sistema
            </button>

            <button
              type="button"
              onClick={() => {
                setIsStartMenuOpen(false);
                openExitModal();
              }}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
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
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            objectivePanelVisible
              ? "bg-emerald-500/15 text-emerald-100"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          <ClipboardList className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3 text-xs text-white/80">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge label="Tiempo" value={formatElapsed()} />
          <Badge
            label="Límite"
            value={countdownLabel}
            tone={timeLimitTone}
            title="Tiempo restante del caso según la dificultad actual."
          />
          {isPaused && (
            <Badge
              label="Estado"
              value="Pausado"
              tone="warning"
              title="La sesión quedó congelada al salir del juego. Se reanuda al volver."
            />
          )}
          <Badge
            label="Precisión"
            value={accuracyPercent === null ? "—" : `${accuracyPercent}%`}
            tone={
              accuracyPercent !== null && accuracyPercent < 50
                ? "warning"
                : "default"
            }
            title="Porcentaje de comandos exitosos sobre el total ejecutado."
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
  tone?: "default" | "warning" | "danger";
  title?: string;
};

function Badge({ label, value, tone = "default", title }: BadgeProps) {
  const toneClasses =
    tone === "danger"
      ? "border-red-400/30 bg-red-400/10 text-red-200"
      : tone === "warning"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
        : "border-white/15 bg-white/5 text-white";

  return (
    <div
      className={`rounded-xl border px-3 py-1 text-[0.65rem] ${toneClasses}`}
      title={title}
    >
      <span className="uppercase tracking-wider text-white/60">{label}</span>
      <span className="ml-2 font-semibold text-white">{value}</span>
    </div>
  );
}
