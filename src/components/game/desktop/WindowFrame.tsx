"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import { X } from "lucide-react";
import { useGameUIStore } from "@/store/useGameUIStore";
import type { PointerEvent, ReactNode } from "react";
import type { WindowPosition, WindowSize } from "@/types/game";

type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

type WindowFrameProps = {
  id: string;
  title: string;
  zIndex?: number;
  position: WindowPosition;
  size: WindowSize;
  children: ReactNode;
};

export default function WindowFrame({
  id,
  title,
  zIndex = 20,
  position,
  size,
  children,
}: WindowFrameProps) {
  const closeWindow = useGameUIStore((state) => state.closeWindow);
  const focusWindow = useGameUIStore((state) => state.focusWindow);
  const setWindowPosition = useGameUIStore((state) => state.setWindowPosition);
  const setWindowSize = useGameUIStore((state) => state.setWindowSize);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempSize, setTempSize] = useState<WindowSize | null>(null);
  const [viewportSize, setViewportSize] = useState({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window === "undefined") return;
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

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

  const minConstraints: [number, number] = [420, 320];
  const maxConstraints: [number, number] = [
    Math.max(minConstraints[0], viewportSize.width - 64),
    Math.max(minConstraints[1], viewportSize.height - 140),
  ];

  const appliedSize = useMemo(() => tempSize ?? size, [tempSize, size]);

  return (
    <ResizableBox
      className="absolute"
      width={appliedSize.width}
      height={appliedSize.height}
      minConstraints={minConstraints}
      maxConstraints={maxConstraints}
      resizeHandles={["se"]}
      handle={(handleAxis: ResizeHandleAxis, ref) =>
        handleAxis === "se" ? (
          <span
            ref={ref}
            className="pointer-events-auto absolute -bottom-1 -right-1 flex h-6 w-6 cursor-se-resize items-center justify-center rounded-br-2xl border border-white/30 bg-white/30 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-slate-900"
            >
              <path
                d="M2 10L10 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M4.5 10L10 4.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : null
      }
      onResizeStart={() => focusWindow(id)}
      onResize={(_event, data) =>
        setTempSize({
          width: data.size.width,
          height: data.size.height,
        })
      }
      onResizeStop={(_event, data) => {
        const nextSize = {
          width: data.size.width,
          height: data.size.height,
        };
        setTempSize(null);
        setWindowSize(id, nextSize);
      }}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        position: "absolute",
      }}
    >
      <div
        ref={frameRef}
        onMouseDown={() => focusWindow(id)}
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-900/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-200 ease-out"
        style={{
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
    </ResizableBox>
  );
}
