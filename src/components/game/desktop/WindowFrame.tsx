"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useGameUIStore } from "@/store/useGameUIStore";
import type { PointerEvent, ReactNode } from "react";
import type { WindowPosition } from "@/types/game";

type WindowFrameProps = {
  id: string;
  title: string;
  zIndex?: number;
  position: WindowPosition;
  children: ReactNode;
};

export default function WindowFrame({
  id,
  title,
  zIndex = 20,
  position,
  children,
}: WindowFrameProps) {
  const closeWindow = useGameUIStore((state) => state.closeWindow);
  const focusWindow = useGameUIStore((state) => state.focusWindow);
  const setWindowPosition = useGameUIStore((state) => state.setWindowPosition);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-window-control]")) {
      dragOffsetRef.current = null;
      return;
    }
    focusWindow(id);
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOffsetRef.current) return;
    const frame = frameRef.current;
    if (!frame) return;

    const { x: offsetX, y: offsetY } = dragOffsetRef.current;
    const viewportWidth = window.innerWidth || frame.offsetWidth;
    const viewportHeight = window.innerHeight || frame.offsetHeight;
    const windowWidth = frame.offsetWidth;
    const windowHeight = frame.offsetHeight;

    const padding = 12;
    const maxX = Math.max(viewportWidth - windowWidth - padding, padding);
    const maxY = Math.max(viewportHeight - windowHeight - padding, padding);

    const nextX = clamp(event.clientX - offsetX, padding, maxX);
    const nextY = clamp(event.clientY - offsetY, padding, maxY);

    setWindowPosition(id, { x: nextX, y: nextY });
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragOffsetRef.current = null;
    setIsDragging(false);
  };

  return (
    <div
      ref={frameRef}
      onMouseDown={() => focusWindow(id)}
      className="absolute flex h-105 w-[90%] max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-900/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-200 ease-out"
      style={{
        zIndex,
        left: position.x,
        top: position.y,
        transitionProperty: isDragging ? "none" : "box-shadow, border-color",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/10 px-4 py-3 cursor-move select-none backdrop-blur-md"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={(event) => {
          if (event.buttons === 0) {
            endDrag(event);
          }
        }}
        onPointerCancel={endDrag}
      >
        <span className="text-sm font-semibold text-white">{title}</span>

        <button
          onClick={() => closeWindow(id)}
          className="rounded-md p-1 text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
          data-window-control
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
}
