"use client";

import type { PanInfo } from "framer-motion";
import { domAnimation, LazyMotion, m, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";
import type { DesktopItem, Difficulty } from "@/features/game/types/game";
import XpIcon from "@/features/game/ui/desktop/XpIcon";

type DesktopIconProps = {
  item: DesktopItem;
  insideWindow?: boolean;
  defaultIndex?: number;
  allItems?: DesktopItem[];
};

const GRID_SIZE = 96;
const MAX_ROWS = 7;
const PADDING = 16;
const DESKTOP_OFFSET = 120;

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

type KnowledgeHint = {
  name: string;
  knowledge:
    | "knowsWifiFix"
    | "knowsFirewallFix"
    | "knowsMalwareFix"
    | "knowsDnsFix"
    | "knowsServiceRestart"
    | "knowsSwitchFix"
    | "knowsDnsDiagnostics"
    | "knowsDnsOverride"
    | "knowsServicesVerification"
    | "knowsIncidentReport"
    | "knowsSwitchAudit"
    | "knowsPerimeterScan"
    | "knowsWatchdog";
  text: string;
  minDifficulty?: Difficulty;
  exactDifficulty?: Difficulty;
};

const KNOWLEDGE_HINTS = [
  {
    name: "network.txt",
    knowledge: "knowsWifiFix",
    text: "Nueva pista descubierta: el reporte de red contiene la solucion del Wi-Fi.",
  },
  {
    name: "firewall.txt",
    knowledge: "knowsFirewallFix",
    text: "Nueva pista descubierta: el analisis del firewall revela una regla bloqueada.",
  },
  {
    name: "suspicious-processes.txt",
    knowledge: "knowsMalwareFix",
    text: "Nueva pista descubierta: identificaste un proceso sospechoso en ejecucion.",
  },
  {
    name: "resolver.conf",
    minDifficulty: "medium",
    knowledge: "knowsDnsFix",
    text: "Reporte DNS analizado: puedes normalizar los reenviadores con 'fix dns'.",
  },
  {
    name: "system.log",
    minDifficulty: "medium",
    knowledge: "knowsServiceRestart",
    text: "Los logs indican que debes ejecutar 'restart services' tras estabilizar la red.",
  },
  {
    name: "switch.conf",
    exactDifficulty: "hard",
    knowledge: "knowsSwitchFix",
    text: "Configuracion de switch encontrada: habilita el puerto critico con 'enable port'.",
  },
  {
    name: "ops-note.txt",
    minDifficulty: "medium",
    knowledge: "knowsDnsDiagnostics",
    text: "Las notas operativas ordenan ejecutar 'diag dns' antes de aplicar cualquier fix.",
  },
  {
    name: "dns-runes.png",
    minDifficulty: "medium",
    knowledge: "knowsDnsDiagnostics",
    text: "El rompecabezas DNS confirma que la secuencia correcta es DIAG -> FIX.",
  },
  {
    name: "dns-lock.png",
    minDifficulty: "medium",
    knowledge: "knowsDnsOverride",
    text: "El candado DNS revela el override 8-8-4 necesario para desbloquear el fix.",
  },
  {
    name: "service-manual.txt",
    minDifficulty: "medium",
    knowledge: "knowsServicesVerification",
    text: "El playbook exige correr 'verify services' antes de 'restart services'.",
  },
  {
    name: "incident-template.txt",
    minDifficulty: "medium",
    knowledge: "knowsIncidentReport",
    text: "Necesitaras completar el informe ejecutando 'file report' tras los arreglos.",
  },
  {
    name: "switch-override.txt",
    exactDifficulty: "hard",
    knowledge: "knowsSwitchAudit",
    text: "Notas del switch: corre 'audit switch' antes de 'enable port'.",
  },
  {
    name: "tamper-photo.png",
    exactDifficulty: "hard",
    knowledge: "knowsPerimeterScan",
    text: "La foto del sello manipulado sugiere ejecutar 'scan perimeter'.",
  },
  {
    name: "perimeter-note.txt",
    exactDifficulty: "hard",
    knowledge: "knowsPerimeterScan",
    text: "El memo de perimetro exige documentar un 'scan perimeter' antes del cierre.",
  },
  {
    name: "chain-of-custody.txt",
    exactDifficulty: "hard",
    knowledge: "knowsIncidentReport",
    text: "La cadena de custodia detalla los datos requeridos por 'file report'.",
  },
  {
    name: "watchdog-brief.txt",
    exactDifficulty: "hard",
    knowledge: "knowsWatchdog",
    text: "El briefing del SOC exige desplegar un watchdog tras el escaneo perimetral.",
  },
] as const satisfies ReadonlyArray<KnowledgeHint>;

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
  const alertEffectState = useGameSessionStore(
    (state) => state.alertEffectState,
  );
  const activeAlert = useGameSessionStore((state) => state.activeAlert);

  const currentPos =
    iconPositions[item.id] ?? getDefaultPositionForIndex(defaultIndex);

  const controls = useAnimation();

  useEffect(() => {
    controls.start(currentPos);
  }, [currentPos, controls]);

  const handleOpen = () => {
    if (alertEffectState.filesystemLocked) {
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "error",
          text:
            activeAlert?.reminder ??
            "Acceso a archivos bloqueado. Resuelve la alerta activa para continuar.",
        },
      ]);
      return;
    }

    maybeAddKnowledgeHint({
      itemName: item.name,
      difficulty: currentDifficulty,
      discoverKnowledge,
      addTerminalLines,
    });

    openWindow({
      id: item.id,
      title: item.name,
      type: item.type,
      content: item.content,
      imageUrl: item.imageUrl,
      children: item.children,
    });
  };

  const displayName = alertEffectState.labelsScrambled
    ? scrambleLabel(item.name)
    : item.name;
  const scrambleMotionClass = alertEffectState.labelsScrambled
    ? "motion-safe:animate-bounce"
    : "";

  if (insideWindow) {
    return (
      <WindowIconButton
        item={item}
        displayName={displayName}
        scrambleMotionClass={scrambleMotionClass}
        onOpen={handleOpen}
      />
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
    <DraggableIconButton
      item={item}
      displayName={displayName}
      scrambleMotionClass={scrambleMotionClass}
      currentPos={currentPos}
      controls={controls}
      onOpen={handleOpen}
      onDragEnd={handleDragEnd}
    />
  );
}

function WindowIconButton({
  item,
  displayName,
  scrambleMotionClass,
  onOpen,
}: {
  item: DesktopItem;
  displayName: string;
  scrambleMotionClass: string;
  onOpen: () => void;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <button
        type="button"
        onDoubleClick={onOpen}
        className={`group flex w-24 flex-col items-center gap-1 p-1 text-black outline-none ${scrambleMotionClass}`}
        aria-label={`Abrir ${item.name}`}
        title={item.name}
      >
        <XpIcon type={item.type} className="size-10 group-focus:opacity-75" />
        <span className="max-w-24 px-0.5 text-center text-[11px] group-focus:bg-[#316ac5] group-focus:text-white">
          {displayName}
        </span>
      </button>
    </LazyMotion>
  );
}

function DraggableIconButton({
  item,
  displayName,
  scrambleMotionClass,
  currentPos,
  controls,
  onOpen,
  onDragEnd,
}: {
  item: DesktopItem;
  displayName: string;
  scrambleMotionClass: string;
  currentPos: { x: number; y: number };
  controls: ReturnType<typeof useAnimation>;
  onOpen: () => void;
  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <m.button
        drag
        dragMomentum={false}
        onDragEnd={onDragEnd}
        onDoubleClick={onOpen}
        initial={currentPos}
        animate={controls}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ position: "absolute" }}
        className={`group flex w-24 flex-col items-center gap-1 p-1 text-white outline-none ${scrambleMotionClass}`}
        aria-label={`Abrir ${item.name}`}
        title={item.name}
      >
        <XpIcon type={item.type} className="size-12 group-focus:opacity-75" />
        <span className="max-w-24 px-0.5 text-center text-[11px] [text-shadow:1px_1px_1px_#000] group-focus:bg-[#316ac5] group-focus:[text-shadow:none]">
          {displayName}
        </span>
      </m.button>
    </LazyMotion>
  );
}

function getDefaultPositionForIndex(index: number) {
  const col = Math.floor(index / MAX_ROWS);
  const row = index % MAX_ROWS;
  return {
    x: col * GRID_SIZE + PADDING,
    y: row * GRID_SIZE + PADDING,
  };
}

function matchesDifficulty(hint: KnowledgeHint, difficulty: Difficulty) {
  if (hint.exactDifficulty && hint.exactDifficulty !== difficulty) return false;
  if (
    hint.minDifficulty &&
    DIFFICULTY_ORDER[difficulty] < DIFFICULTY_ORDER[hint.minDifficulty]
  ) {
    return false;
  }
  return true;
}

function maybeAddKnowledgeHint({
  itemName,
  difficulty,
  discoverKnowledge,
  addTerminalLines,
}: {
  itemName: string;
  difficulty: Difficulty;
  discoverKnowledge: (key: KnowledgeHint["knowledge"]) => void;
  addTerminalLines: (
    lines: { id: string; type: "hint"; text: string }[],
  ) => void;
}) {
  const hint = KNOWLEDGE_HINTS.find((entry) => entry.name === itemName);
  if (!hint) return;
  if (!matchesDifficulty(hint, difficulty)) return;

  discoverKnowledge(hint.knowledge);
  addTerminalLines([
    {
      id: crypto.randomUUID(),
      type: "hint",
      text: hint.text,
    },
  ]);
}

function scrambleLabel(label: string) {
  return label
    .split("")
    .map((char, index) => {
      const base = char.charCodeAt(0);
      const offset = (index * 7 + 13) % 26;
      if (base >= 65 && base <= 90) {
        return String.fromCharCode(((base - 65 + offset) % 26) + 65);
      }
      if (base >= 97 && base <= 122) {
        return String.fromCharCode(((base - 97 + offset) % 26) + 97);
      }
      return char;
    })
    .join("");
}
