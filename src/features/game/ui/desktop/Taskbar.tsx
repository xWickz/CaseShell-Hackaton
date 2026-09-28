"use client";

import {
  ClipboardList,
  Monitor,
  Power,
  RotateCcw,
  TerminalSquare,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";
import XpIcon from "@/features/game/ui/desktop/XpIcon";

export default function Taskbar() {
  const [now, setNow] = useState(() => new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const commandStats = useGameSessionStore((state) => state.commandStats);
  const timeLimitMs = useGameSessionStore((state) => state.timeLimitMs);
  const timeRemainingMs = useGameSessionStore((state) => state.timeRemainingMs);
  const isPaused = useGameSessionStore((state) => state.isPaused);

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
  const openWindows = useGameUIStore((state) => state.openWindows);
  const focusWindow = useGameUIStore((state) => state.focusWindow);
  const minimizeWindow = useGameUIStore((state) => state.minimizeWindow);

  const topZIndex = Math.max(
    0,
    ...openWindows.filter((w) => !w.minimized).map((w) => w.zIndex),
  );

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
    <div className="os-taskbar absolute bottom-0 left-0 right-0 z-999 flex items-center text-white">
      <div
        className="relative flex h-full items-center gap-2"
        ref={startMenuRef}
      >
        <button
          type="button"
          onClick={() => setIsStartMenuOpen((prev) => !prev)}
          aria-label="Abrir menú de inicio"
          aria-expanded={isStartMenuVisible}
          className={`os-start flex items-center gap-1.5 ${
            isStartMenuVisible ? "brightness-90" : ""
          }`}
        >
          <TerminalSquare className="size-5" />
          <span>inicio</span>
        </button>

        {isStartMenuVisible && (
          <div className="absolute bottom-full left-0 w-72 rounded-t-lg border-2 border-[#0a246a] bg-white text-[12px] text-black shadow-[2px_2px_8px_rgba(0,0,0,0.5)]">
            <div className="xp-menu-band flex items-center gap-2 rounded-t-md px-2 py-2">
              <span className="grid size-10 place-items-center rounded-[3px] border-2 border-white bg-[#e8a53a]">
                <User className="size-6 text-white" />
              </span>
              <span className="text-[14px] font-bold text-white [text-shadow:1px_1px_#0a246a]">
                Agente
              </span>
            </div>

            <div className="relative py-1">
              <button
                type="button"
                onClick={handleSoundButtonClick}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#316ac5] hover:text-white"
              >
                {alertSoundsEnabled ? (
                  <Volume2 className="size-6 text-[#0a4fd6]" />
                ) : (
                  <VolumeX className="size-6 text-[#808080]" />
                )}
                <span>
                  <b className="block">Sonidos de virus</b>
                  {alertSoundsEnabled ? "Activados" : "Silenciados"}
                </span>
              </button>

              {virusAlertTooltipOpen && (
                <div className="absolute left-[calc(100%+0.5rem)] top-0 z-20 w-60 rounded-lg border border-black bg-[#ffffe1] p-3 text-[11px] text-black shadow-[2px_2px_4px_rgba(0,0,0,0.4)]">
                  <p className="font-bold">Consejo</p>
                  <p className="mt-1">
                    Si te molestan los sonidos de alerta, puedes silenciarlos
                    aquí.
                  </p>
                  <button
                    type="button"
                    onClick={handleAcknowledgeTooltip}
                    className="xp-button mt-2"
                  >
                    Entendido
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={toggleCrtOverlay}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#316ac5] hover:text-white"
              >
                <Monitor className="size-6 text-[#0a4fd6]" />
                <span>
                  <b className="block">Filtro CRT</b>
                  {crtOverlayEnabled ? "Activo" : "Desactivado"}
                </span>
              </button>
            </div>

            <div className="xp-menu-band flex justify-end gap-3 px-3 py-2 text-white">
              <button
                type="button"
                onClick={() => {
                  setIsStartMenuOpen(false);
                  openResetModal();
                }}
                className="flex items-center gap-1.5 hover:brightness-125"
              >
                <span className="grid size-6 place-items-center rounded-[3px] border border-white bg-[#3c9c38]">
                  <RotateCcw className="size-4" />
                </span>
                Reiniciar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsStartMenuOpen(false);
                  openExitModal();
                }}
                className="flex items-center gap-1.5 hover:brightness-125"
              >
                <span className="grid size-6 place-items-center rounded-[3px] border border-white bg-[#dc5a2a]">
                  <Power className="size-4" />
                </span>
                Apagar equipo
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={openObjectivePanel}
          aria-label="Mostrar panel de objetivos"
          aria-pressed={objectivePanelVisible}
          className="rounded-[3px] p-1 hover:bg-white/20 aria-pressed:bg-black/20"
        >
          <ClipboardList className="size-5" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-1 px-2">
        {openWindows.map((w) => {
          const isActive = !w.minimized && w.zIndex === topZIndex;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() =>
                isActive ? minimizeWindow(w.id) : focusWindow(w.id)
              }
              aria-pressed={isActive}
              className="os-taskbtn flex max-w-40 min-w-0 items-center gap-1.5 px-2 text-left"
            >
              <XpIcon type={w.type} className="size-4 shrink-0" />
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>

      <div className="os-tray flex items-center gap-3 text-[11px]">
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
        <span title={dateLabel}>{timeLabel}</span>
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
  const toneClass =
    tone === "danger"
      ? "text-[#ffd0d0]"
      : tone === "warning"
        ? "text-[#fff3a0]"
        : "text-white";

  return (
    <span className={toneClass} title={title}>
      {label}: <b>{value}</b>
    </span>
  );
}
