"use client";

import { TerminalSquare, Trophy, House } from "lucide-react";

export default function Taskbar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[999] flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20">
          <House className="h-5 w-5" />
        </button>

        <button className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20">
          <TerminalSquare className="h-5 w-5" />
        </button>

        <button className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20">
          <Trophy className="h-5 w-5" />
        </button>
      </div>

      <div className="text-xs font-medium text-white/70">CaseShell OS</div>
    </div>
  );
}
