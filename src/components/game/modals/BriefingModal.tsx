"use client";

import { useEffect, useRef, useState } from "react";
import { useGameUIStore } from "@/store/useGameUIStore";
import type { Briefing } from "@/types/game";

type BriefingModalProps = {
  briefing: Briefing;
};

export default function BriefingModal({ briefing }: BriefingModalProps) {
  const briefingOpen = useGameUIStore((state) => state.briefingOpen);
  const closeBriefing = useGameUIStore((state) => state.closeBriefing);
  const [canDismiss, setCanDismiss] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const headingId = "briefing-heading";

  useEffect(() => {
    let frame: number | null = null;

    const runMeasurement = () => {
      const container = contentRef.current;
      if (!container) return;
      const needsScroll = container.scrollHeight > container.clientHeight + 4;
      setCanDismiss(!needsScroll);
    };

    frame = requestAnimationFrame(() => {
      if (!briefingOpen) {
        setCanDismiss(false);
        return;
      }
      runMeasurement();
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [briefing, briefingOpen]);

  const handleScroll = () => {
    if (!briefingOpen) return;
    const container = contentRef.current;
    if (!container || canDismiss) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      setCanDismiss(true);
    }
  };

  if (!briefingOpen) return null;

  return (
    <div
      className="absolute inset-0 z-1000 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            {briefing.title}
          </p>
          <h2 id={headingId} className="mt-2 text-3xl font-bold text-white">
            Investigación iniciada
          </h2>
        </div>

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="mb-4 max-h-72 space-y-6 overflow-y-auto pr-2 text-white/80"
        >
          <p>{briefing.description}</p>

          {briefing.hints?.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              {briefing.hints.map((hint, index) => (
                <p key={index}>- {hint}</p>
              ))}
            </div>
          ) : null}
        </div>

        <button
          onClick={closeBriefing}
          disabled={!canDismiss}
          className={`mt-2 w-full rounded-2xl px-5 py-3 font-semibold text-slate-950 transition ${
            canDismiss
              ? "bg-cyan-500 hover:bg-cyan-400"
              : "bg-cyan-900/50 text-white/50"
          }`}
        >
          {canDismiss
            ? "Comenzar investigación"
            : "Desplázate para desbloquear"}
        </button>
      </div>
    </div>
  );
}
