"use client";

import { useEffect } from "react";

const BOOT_DURATION_MS = 2800;

export default function XpBootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDone, BOOT_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [onDone]);

  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Saltar pantalla de arranque"
      className="xp-boot fixed inset-0 z-20000 hidden flex-col items-center justify-center bg-black md:flex"
    >
      <p className="text-5xl font-bold italic tracking-tight text-white">
        CaseShell<sup className="ml-1 text-2xl text-orange-500">xp</sup>
      </p>
      <p className="mt-1 text-sm text-white/60">Professional Edition</p>

      <div className="xp-boot-bar mt-16" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <p className="absolute bottom-8 text-xs text-white/40">
        Haz clic para saltar
      </p>
    </button>
  );
}
