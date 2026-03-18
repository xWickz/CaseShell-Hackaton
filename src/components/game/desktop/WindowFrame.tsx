"use client";

import { X } from "lucide-react";
import { useGameUIStore } from "@/store/useGameUIStore";
import type { ReactNode } from "react";

type WindowFrameProps = {
  id: string;
  title: string;
  zIndex?: number;
  children: ReactNode;
};

export default function WindowFrame({
  id,
  title,
  zIndex = 20,
  children,
}: WindowFrameProps) {
  const closeWindow = useGameUIStore((state) => state.closeWindow);
  const focusWindow = useGameUIStore((state) => state.focusWindow);

  return (
    <div
      onMouseDown={() => focusWindow(id)}
      className="absolute left-1/2 top-1/2 flex h-[420px] w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur-xl"
      style={{ zIndex }}
    >
      <div className="flex shrink-0 items-center justify-between rounded-t-2xl border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="text-sm font-semibold text-white">{title}</span>

        <button
          onClick={() => closeWindow(id)}
          className="rounded-md p-1 text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
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
