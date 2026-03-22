"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FileText,
  Folder,
  ImageIcon,
  TerminalSquare,
  MessageSquareText,
} from "lucide-react";
import { useGameUIStore } from "@/store/useGameUIStore";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { DesktopItem } from "@/types/game";
import type { PanInfo } from "framer-motion";

type DesktopIconProps = {
  item: DesktopItem;
  insideWindow?: boolean;
  defaultIndex?: number;
  allItems?: DesktopItem[];
};

const GRID_SIZE = 96;

export default function DesktopIcon({
  item,
  insideWindow = false,
  defaultIndex = 0,
  allItems = [],
}: DesktopIconProps) {
  const openWindow = useGameUIStore((state) => state.openWindow);
  const iconPositions = useGameUIStore((state) => state.iconPositions);
  const setIconPosition = useGameUIStore((state) => state.setIconPosition);

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

    if (item.name === "ops-note.txt" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsDiagnostics");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Las notas operativas ordenan ejecutar 'diag dns' antes de aplicar cualquier fix.",
        },
      ]);
    }

    if (item.name === "dns-runes.png" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsDiagnostics");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El rompecabezas DNS confirma que la secuencia correcta es DIAG ➜ FIX.",
        },
      ]);
    }

    if (item.name === "dns-lock.png" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsOverride");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El candado DNS revela el override 8-8-4 necesario para desbloquear el fix.",
        },
      ]);
    }

    if (item.name === "service-manual.txt" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsServicesVerification");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El playbook exige correr 'verify services' antes de 'restart services'.",
        },
      ]);
    }

    if (item.name === "incident-template.txt" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsIncidentReport");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Necesitarás completar el informe ejecutando 'file report' tras los arreglos.",
        },
      ]);
    }

    if (item.name === "switch-override.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsSwitchAudit");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Notas del switch: corre 'audit switch' antes de 'enable port'.",
        },
      ]);
    }

    if (item.name === "tamper-photo.png" && currentDifficulty === "hard") {
      discoverKnowledge("knowsPerimeterScan");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "La foto del sello manipulado sugiere ejecutar 'scan perimeter'.",
        },
      ]);
    }

    if (item.name === "perimeter-note.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsPerimeterScan");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El memo de perímetro exige documentar un 'scan perimeter' antes del cierre.",
        },
      ]);
    }

    if (item.name === "chain-of-custody.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsIncidentReport");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "La cadena de custodia detalla los datos requeridos por 'file report'.",
        },
      ]);
    }

    if (item.name === "watchdog-brief.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsWatchdog");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El briefing del SOC exige desplegar un watchdog tras el escaneo perimetral.",
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
      case "chat":
        return <MessageSquareText className={`${iconClass} text-emerald-200`} />;
      default:
        return <FileText className={`${iconClass} text-white`} />;
    }
  };

  const MAX_ROWS = 7; 
  const PADDING = 16;
  const DESKTOP_OFFSET = 120;

  const getDefaultPositionForIndex = (index: number) => {
    const col = Math.floor(index / MAX_ROWS);
    const row = index % MAX_ROWS;
    return {
      x: col * GRID_SIZE + PADDING,
      y: row * GRID_SIZE + PADDING,
    };
  };

  const currentPos =
    iconPositions[item.id] ?? getDefaultPositionForIndex(defaultIndex);

  const controls = useAnimation();

  useEffect(() => {
    controls.start(currentPos);
  }, [currentPos, controls]);

  if (insideWindow) {
    return (
      <button
        onDoubleClick={handleOpen}
        className="flex w-24 flex-col items-center gap-2 rounded-xl p-2 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
        aria-label={`Abrir ${item.name}`}
        title={item.name}
      >
        {renderIcon()}
        <span className="max-w-25 text-center text-xs font-medium">
          {item.name}
        </span>
      </button>
    );
  }

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const rawX = currentPos.x + info.offset.x;
    const rawY = currentPos.y + info.offset.y;

    let snappedX =
      Math.round((rawX - PADDING) / GRID_SIZE) * GRID_SIZE + PADDING;
    let snappedY =
      Math.round((rawY - PADDING) / GRID_SIZE) * GRID_SIZE + PADDING;

    const DESKTOP_OFFSET = 120; 
    const maxX =
      typeof window !== "undefined"
        ? window.innerWidth - GRID_SIZE - PADDING
        : 1920;
    const maxY =
      typeof window !== "undefined"
        ? window.innerHeight - DESKTOP_OFFSET - GRID_SIZE
        : 1080;

    if (snappedX < PADDING) snappedX = PADDING;
    if (snappedY < PADDING) snappedY = PADDING;

    if (snappedX > maxX)
      snappedX = Math.floor((maxX - PADDING) / GRID_SIZE) * GRID_SIZE + PADDING;
    if (snappedY > maxY)
      snappedY = Math.floor((maxY - PADDING) / GRID_SIZE) * GRID_SIZE + PADDING;

    const occupies = (x: number, y: number) => {
      const storePositions = useGameUIStore.getState().iconPositions;
      return allItems.some((otherItem, index) => {
        if (otherItem.id === item.id) return false;
        const otherPos =
          storePositions[otherItem.id] ?? getDefaultPositionForIndex(index);
        return Math.abs(otherPos.x - x) < 10 && Math.abs(otherPos.y - y) < 10;
      });
    };

    if (occupies(snappedX, snappedY)) {
      controls.start({
        x: currentPos.x,
        y: currentPos.y,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      });
    } else {
      setIconPosition(item.id, { x: snappedX, y: snappedY });
    }
  };

  return (
    <motion.button
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleOpen}
      initial={currentPos}
      animate={controls}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ position: "absolute" }}
      className="flex w-24 flex-col items-center gap-2 rounded-xl p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      aria-label={`Abrir ${item.name}`}
      title={item.name}
    >
      {renderIcon()}
      <span className="max-w-25 text-center text-xs font-medium drop-shadow-md">
        {item.name}
      </span>
    </motion.button>
  );
}
