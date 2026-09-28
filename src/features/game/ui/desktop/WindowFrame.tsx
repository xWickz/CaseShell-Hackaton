"use client";

import { Minus, X } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";
import type { WindowPosition, WindowSize } from "@/features/game/types/game";

type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

type WindowFrameProps = {
  id: string;
  title: string;
  zIndex?: number;
  position: WindowPosition;
  size: WindowSize;
  minimized?: boolean;
  children: ReactNode;
};

export default function WindowFrame({
  id,
  title,
  zIndex = 20,
  position,
  size,
  minimized = false,
  children,
}: WindowFrameProps) {
  const closeWindow = useGameUIStore((state) => state.closeWindow);
  const focusWindow = useGameUIStore((state) => state.focusWindow);
  const minimizeWindow = useGameUIStore((state) => state.minimizeWindow);
  const setWindowPosition = useGameUIStore((state) => state.setWindowPosition);
  const setWindowSize = useGameUIStore((state) => state.setWindowSize);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
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
            className="pointer-events-auto absolute bottom-0 right-0 flex size-4 cursor-se-resize items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-[#808080]"
            >
              <title>s</title>
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
        display: minimized ? "none" : undefined,
      }}
    >
      <section
        role="region"
        ref={frameRef}
        onMouseDown={() => focusWindow(id)}
        className="os-window flex h-full w-full flex-col overflow-hidden"
      >
        <div
          className="os-titlebar flex shrink-0 items-center justify-between select-none"
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
          <span className="truncate text-white">{title}</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => minimizeWindow(id)}
              aria-label={`Minimizar ${title}`}
              className="os-titlebtn"
              data-window-control
            >
              <Minus className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => closeWindow(id)}
              aria-label={`Cerrar ${title}`}
              className="os-titlebtn os-close"
              data-window-control
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden p-[3px]">
          {children}
        </div>
      </section>
    </ResizableBox>
  );
}
