"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DesktopIcon from "@/components/game/desktop/DesktopIcon";
import Taskbar from "@/components/game/desktop/Taskbar";
import BriefingModal from "@/components/game/modals/BriefingModal";
import TerminalWindow from "@/components/game/terminal/TerminalWindow";
import WindowFrame from "@/components/game/desktop/WindowFrame";
import FileViewer from "@/components/game/files/FileViewer";
import FolderViewer from "@/components/game/files/FolderViewer";
import { useGameUIStore } from "@/store/useGameUIStore";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { DesktopItem, Briefing, Difficulty } from "@/types/game";
import VictoryModal from "@/components/game/modals/VictoryModal";
import OnboardingOverlay from "@/components/game/modals/OnboardingOverlay";
import ExitModal from "@/components/game/modals/ExitModal";
import ResetModal from "@/components/game/modals/ResetModal";
import FailureModal from "@/components/game/modals/FailureModal";
import GameTimerController from "@/components/game/system/GameTimerController";
import Link from "next/link";
import ObjectiveTracker from "@/components/game/desktop/ObjectiveTracker";
import OpsChatWindow from "@/components/game/chat/OpsChatWindow";

type DesktopProps = {
  items: DesktopItem[];
  briefing: Briefing;
  difficulty: Difficulty;
};

export default function Desktop({ items, briefing, difficulty }: DesktopProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);

  const previousCompletedRef = useRef(false);

  const openWindows = useGameUIStore((state) => state.openWindows);
  const openWindow = useGameUIStore((state) => state.openWindow);
  const setDifficulty = useGameUIStore((state) => state.setDifficulty);
  const wallpaperTheme = useGameUIStore((state) => state.wallpaperTheme);
  const hasSeenOnboarding = useGameUIStore((state) => state.hasSeenOnboarding);
  const completeOnboarding = useGameUIStore(
    (state) => state.completeOnboarding,
  );
  const objectivePanelVisible = useGameUIStore(
    (state) => state.objectivePanelVisible,
  );
  const objectivePanelCollapsed = useGameUIStore(
    (state) => state.objectivePanelCollapsed,
  );
  const closeObjectivePanel = useGameUIStore(
    (state) => state.closeObjectivePanel,
  );
  const toggleObjectivePanelCollapsed = useGameUIStore(
    (state) => state.toggleObjectivePanelCollapsed,
  );
  const crtOverlayEnabled = useGameUIStore((state) => state.crtOverlayEnabled);

  const initializeSession = useGameSessionStore(
    (state) => state.initializeSession,
  );
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );
  const alertEffectState = useGameSessionStore(
    (state) => state.alertEffectState,
  );
  const activeAlert = useGameSessionStore((state) => state.activeAlert);
  const isCaseCompleted = useGameSessionStore(
    (state) => state.caseState.progress.completed,
  );

  const wallpaperClasses = useMemo(() => {
    switch (wallpaperTheme) {
      case "ocean":
        return "from-slate-900 via-cyan-900 to-blue-900";
      case "matrix":
        return "from-black via-emerald-950 to-slate-900";
      default:
        return "from-slate-900 via-slate-800 to-slate-950";
    }
  }, [wallpaperTheme]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setDifficulty(difficulty);
    if (currentDifficulty !== difficulty) {
      initializeSession(difficulty);
    }
  }, [difficulty, currentDifficulty, setDifficulty, initializeSession]);

  useEffect(() => {
    openWindow({
      id: "terminal-main",
      title: "Terminal",
      type: "terminal",
    });
    // Solo al montar la pantalla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        openWindow({
          id: "terminal-main",
          title: "Terminal",
          type: "terminal",
        });
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [openWindow]);

  useEffect(() => {
    if (isCaseCompleted && !previousCompletedRef.current) {
      setShowCompletionBanner(true);

      const timeoutId = window.setTimeout(() => {
        setShowCompletionBanner(false);
      }, 2600);

      previousCompletedRef.current = true;

      return () => window.clearTimeout(timeoutId);
    }

    if (!isCaseCompleted) {
      previousCompletedRef.current = false;
      setShowCompletionBanner(false);
    }
  }, [isCaseCompleted]);

  if (!isMounted) {
    return (
      <main
        className={`relative h-screen w-full overflow-hidden bg-linear-to-br ${wallpaperClasses}`}
      />
    );
  }

  return (
    <main
      className={`relative h-screen w-full overflow-hidden bg-linear-to-br ${wallpaperClasses}`}
    >
      <GameTimerController />

      {/* Wallpaper overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_30%)]" />

      {/* Banner de objetivos completados */}
      {showCompletionBanner && (
        <div className="pointer-events-none absolute left-1/2 top-6 z-[1400] -translate-x-1/2 animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-center shadow-[0_12px_40px_rgba(16,185,129,0.18)] backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-200/80">
              Objetivos
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Todos los objetivos listos
            </p>
          </div>
        </div>
      )}

      {/* Desktop icons */}
      <div className="relative z-10 h-[calc(100vh-140px)] w-full">
        {items.map((item, index) => (
          <DesktopIcon
            key={item.id}
            item={item}
            defaultIndex={index}
            allItems={items}
          />
        ))}
      </div>

      {/* Open windows */}
      {openWindows.map((window) => (
        <WindowFrame
          key={window.id}
          id={window.id}
          title={window.title}
          zIndex={window.zIndex}
          position={window.position}
          size={window.size}
        >
          {window.type === "terminal" ? (
            <TerminalWindow />
          ) : window.type === "folder" ? (
            <FolderViewer items={window.children ?? []} />
          ) : window.type === "chat" ? (
            <OpsChatWindow difficulty={difficulty} />
          ) : (
            <FileViewer
              type={window.type}
              content={window.content}
              imageUrl={window.imageUrl}
            />
          )}
        </WindowFrame>
      ))}

      {objectivePanelVisible && (
        <div className="pointer-events-none absolute right-6 top-6 z-1200 hidden xl:block">
          <ObjectiveTracker
            collapsed={objectivePanelCollapsed}
            onToggleCollapse={toggleObjectivePanelCollapsed}
            onClose={closeObjectivePanel}
          />
        </div>
      )}

      <BriefingModal briefing={briefing} />
      <VictoryModal />
      <FailureModal />
      <ExitModal />
      <ResetModal />

      {!hasSeenOnboarding && (
        <OnboardingOverlay onDismiss={completeOnboarding} />
      )}

      <Taskbar />

      {alertEffectState.screenObscured && (
        <div className="pointer-events-none absolute inset-0 z-[1500] flex flex-col items-center justify-center bg-black/70 text-center font-mono text-emerald-200 backdrop-blur-md">
          <p className="text-xl font-semibold tracking-wider">Visor cegado</p>
          <p className="mt-2 max-w-sm text-sm text-emerald-100">
            {activeAlert?.reminder ??
              "El HUD está saturado. Limpia la alerta para restaurar la imagen."}
          </p>
          {activeAlert?.resolveCommand && (
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-emerald-400">
              Ejecuta {activeAlert.resolveCommand}
            </p>
          )}
        </div>
      )}

      {crtOverlayEnabled && (
        <div className="crt-overlay crt-flicker pointer-events-none fixed inset-0 z-9999 mix-blend-overlay" />
      )}

      {/* Mobile Blocker Overlay */}
      <div className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-zinc-950 p-8 text-center font-mono md:hidden">
        <div className="mb-4 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="3" rx="2" ry="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">Acceso Denegado</h2>
        <p className="mb-6 max-w-sm text-zinc-400">
          Este entorno de investigación requiere teclado físico y una pantalla
          amplia. Por favor, <strong>accede desde un ordenador</strong>.
        </p>
        <Link
          href="/"
          title="Volver al Inicio"
          className="rounded-full border border-white/30 px-6 py-2 text-md font-bold text-white transition-colors hover:bg-white/10"
        >
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}
