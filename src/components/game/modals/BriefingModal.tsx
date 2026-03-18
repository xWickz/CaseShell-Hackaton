"use client";

import { useGameUIStore } from "@/store/useGameUIStore";
import type { Briefing } from "@/types/game";

type BriefingModalProps = {
  briefing: Briefing;
};

export default function BriefingModal({ briefing }: BriefingModalProps) {
  const briefingOpen = useGameUIStore((state) => state.briefingOpen);
  const closeBriefing = useGameUIStore((state) => state.closeBriefing);

  if (!briefingOpen) return null;

  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            {briefing.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Investigación iniciada
          </h2>
        </div>

        <p className="mb-6 text-white/80">{briefing.description}</p>

        {briefing.hints?.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            {briefing.hints.map((hint, index) => (
              <p key={index}>- {hint}</p>
            ))}
          </div>
        ) : null}

        <button
          onClick={closeBriefing}
          className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Comenzar investigación
        </button>
      </div>
    </div>
  );
}
