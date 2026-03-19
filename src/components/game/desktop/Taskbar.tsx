"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { House } from "lucide-react";

export default function Taskbar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { timeLabel, dateLabel } = useMemo(() => {
    const timeLabel = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateLabel = now.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return { timeLabel, dateLabel };
  }, [now]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[999] flex items-center justify-between gap-6 border-t border-white/10 bg-black/40 px-6 py-3 text-white backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Ir al escritorio principal"
          className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
        >
          <House className="h-5 w-5" />
        </Link>
      </div>

      <div className="text-xs font-medium text-white/70">CaseShell OS</div>

      <div className="flex flex-col text-right text-xs">
        <span className="font-semibold">{timeLabel}</span>
        <span className="text-[0.65rem] uppercase tracking-wide text-white/70">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}
