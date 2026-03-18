"use client";

import { FileText, Folder, ImageIcon, TerminalSquare } from "lucide-react";
import { useGameUIStore } from "@/store/useGameUIStore";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { DesktopItem } from "@/types/game";

type DesktopIconProps = {
  item: DesktopItem;
  insideWindow?: boolean;
};

export default function DesktopIcon({
  item,
  insideWindow = false,
}: DesktopIconProps) {
  const openWindow = useGameUIStore((state) => state.openWindow);

  const discoverKnowledge = useGameSessionStore(
    (state) => state.discoverKnowledge,
  );
  const addTerminalLines = useGameSessionStore(
    (state) => state.addTerminalLines,
  );
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

  const handleOpen = () => {
    if (item.name === "network.txt") {
      discoverKnowledge("knowsWifiFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Nueva pista descubierta: el reporte de red contiene la solución del Wi-Fi.",
        },
      ]);
    }

    if (item.name === "firewall.txt") {
      discoverKnowledge("knowsFirewallFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Nueva pista descubierta: el análisis del firewall revela una regla bloqueada.",
        },
      ]);
    }

    if (item.name === "suspicious-processes.txt") {
      discoverKnowledge("knowsMalwareFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Nueva pista descubierta: identificaste un proceso sospechoso en ejecución.",
        },
      ]);
    }

    if (item.name === "resolver.conf" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Reporte DNS analizado: puedes normalizar los reenviadores con 'fix dns'.",
        },
      ]);
    }

    if (item.name === "system.log" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsServiceRestart");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Los logs indican que debes ejecutar 'restart services' tras estabilizar la red.",
        },
      ]);
    }

    if (item.name === "switch.conf" && currentDifficulty === "hard") {
      discoverKnowledge("knowsSwitchFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Configuración de switch encontrada: habilita el puerto crítico con 'enable port'.",
        },
      ]);
    }

    openWindow({
      id: item.id,
      title: item.name,
      type: item.type,
      content: item.content,
      imageUrl: item.imageUrl,
      children: item.children,
    });
  };

  const iconClass = insideWindow ? "w-8 h-8" : "w-10 h-10";

  const renderIcon = () => {
    switch (item.type) {
      case "text":
        return <FileText className={`${iconClass} text-sky-300`} />;
      case "image":
        return <ImageIcon className={`${iconClass} text-pink-300`} />;
      case "folder":
        return <Folder className={`${iconClass} text-yellow-300`} />;
      case "terminal":
        return <TerminalSquare className={`${iconClass} text-green-300`} />;
      default:
        return <FileText className={`${iconClass} text-white`} />;
    }
  };

  return (
    <button
      onDoubleClick={handleOpen}
      className="flex w-full flex-col items-center gap-2 rounded-xl p-2 text-white transition hover:bg-white/10"
    >
      {renderIcon()}
      <span className="max-w-[100px] text-center text-xs font-medium">
        {item.name}
      </span>
    </button>
  );
}
