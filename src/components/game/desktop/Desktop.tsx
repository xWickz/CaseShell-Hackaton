"use client";

import { useEffect } from "react";
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
type DesktopProps = {
  items: DesktopItem[];
  briefing: Briefing;
  difficulty: Difficulty;
};

export default function Desktop({ items, briefing, difficulty }: DesktopProps) {
  const openWindows = useGameUIStore((state) => state.openWindows);
  const openWindow = useGameUIStore((state) => state.openWindow);
  const setDifficulty = useGameUIStore((state) => state.setDifficulty);

  const initializeSession = useGameSessionStore(
    (state) => state.initializeSession,
  );
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

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

  return (
    <main className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      {/* Wallpaper overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_30%)]" />

      {/* Desktop icons */}
      <div className="relative z-10 flex h-[calc(100vh-120px)] max-w-full flex-col flex-wrap items-start content-start gap-4 p-6">
        {items.map((item) => (
          <DesktopIcon key={item.id} item={item} />
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
        >
          {window.type === "terminal" ? (
            <TerminalWindow />
          ) : window.type === "folder" ? (
            <FolderViewer items={window.children ?? []} />
          ) : (
            <FileViewer
              type={window.type}
              content={window.content}
              imageUrl={window.imageUrl}
            />
          )}
        </WindowFrame>
      ))}

      <BriefingModal briefing={briefing} />
      <VictoryModal />
      <Taskbar />
    </main>
  );
}
