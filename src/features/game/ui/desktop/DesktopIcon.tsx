"use client";

import type { PanInfo } from "framer-motion";
import { domAnimation, LazyMotion, m, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { getSessionCase } from "@/features/game/data/cases";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";
import type { DesktopItem } from "@/features/game/types/game";
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
  const currentCaseId = useGameSessionStore((state) => state.currentCaseId);
  const caseSeed = useGameSessionStore((state) => state.caseSeed);
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

    const hint = getSessionCase(currentCaseId, caseSeed).desktopHints.find(
      (entry) => entry.name === item.name,
    );
    if (hint) {
      discoverKnowledge(hint.knowledge);
      addTerminalLines([
        { id: crypto.randomUUID(), type: "hint", text: hint.text },
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
