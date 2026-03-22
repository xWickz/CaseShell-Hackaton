"use client";

import { useEffect, useMemo, useRef } from "react";
import { MessageSquareMore, Radio, Bot } from "lucide-react";
import { chatScripts, isConditionMet } from "@/data/game/chat-script";
import type { Difficulty } from "@/types/game";
import { useGameSessionStore } from "@/store/useGameSessionStore";

const speakerStyles = {
  ops: {
    label: "CubePath OPS",
    icon: Radio,
    bubble: "bg-emerald-500/10 border-emerald-500/30",
  },
  mentor: {
    label: "Mentor",
    icon: Bot,
    bubble: "bg-cyan-500/10 border-cyan-500/30",
  },
  system: {
    label: "Sistema",
    icon: MessageSquareMore,
    bubble: "bg-white/5 border-white/10",
  },
};

type OpsChatWindowProps = {
  difficulty: Difficulty;
};

export default function OpsChatWindow({ difficulty }: OpsChatWindowProps) {
  const caseProgress = useGameSessionStore((state) => state.caseState.progress);
  const setCurrentInput = useGameSessionStore((state) => state.setCurrentInput);

  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    const script = chatScripts[difficulty];
    return script.filter((entry) =>
      isConditionMet(entry.condition, caseProgress),
    );
  }, [difficulty, caseProgress]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-slate-950/80 text-sm text-white">
      <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            SOC Relay
          </p>
          <h3 className="text-base font-semibold">Canal en tiempo real</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-emerald-500/20 px-3 py-1 text-[0.7rem] font-semibold text-emerald-200">
          {messages.length} msgs
        </span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => {
          const meta = speakerStyles[message.speaker];
          const Icon = meta.icon;
          return (
            <article
              key={message.id}
              className={`rounded-2xl border px-4 py-3 shadow-inner ${meta.bubble}`}
            >
              <header className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-white/70">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {meta.label}
              </header>
              <p className="text-sm text-white/90 leading-relaxed">
                {message.text}
              </p>
              {message.commandHint ? (
                <button
                  type="button"
                  onClick={() => setCurrentInput(message.commandHint ?? "")}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                >
                  ← Sugerir {message.commandHint}
                </button>
              ) : null}
            </article>
          );
        })}

        {!messages.length && (
          <p className="text-center text-xs text-white/50">
            Sin comunicaciones todavía.
          </p>
        )}
      </div>

      <footer className="border-t border-white/5 px-4 py-3 text-[0.7rem] text-white/50">
        Este chat simula al equipo CubePath OPS. Usa las sugerencias para copiar
        comandos en la terminal.
      </footer>
    </div>
  );
}
