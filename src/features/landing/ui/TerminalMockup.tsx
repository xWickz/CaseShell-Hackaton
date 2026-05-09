"use client";

import { useEffect, useMemo, useReducer, useState } from "react";

const TYPING_SPEED = 20;

const terminalText = [
  "agent@cubepath:~$ diag --system",
  "> [OK] Database synced",
  "> [OK] Firewall active",
  "> [WARN] Integrity check failed in: /var/log/syslog.4",
  "> [CRITICAL] Unauthorized access detected",
  "> [ACTION] Investigate and contain the incident",
  "agent@cubepath:~$ _",
];

type TypingState = {
  displayedLines: string[];
  currentLineIndex: number;
  currentTextIndex: number;
};

type TypingAction = { type: "typeChar"; line: string } | { type: "nextLine" };

const INITIAL_TYPING_STATE: TypingState = {
  displayedLines: [],
  currentLineIndex: 0,
  currentTextIndex: 0,
};

function typingReducer(state: TypingState, action: TypingAction): TypingState {
  switch (action.type) {
    case "typeChar": {
      const nextLines = [...state.displayedLines];
      if (state.currentTextIndex === 0) {
        nextLines[state.currentLineIndex] = "";
      }
      nextLines[state.currentLineIndex] = action.line.slice(
        0,
        state.currentTextIndex + 1,
      );
      return {
        ...state,
        displayedLines: nextLines,
        currentTextIndex: state.currentTextIndex + 1,
      };
    }
    case "nextLine":
      return {
        ...state,
        currentLineIndex: state.currentLineIndex + 1,
        currentTextIndex: 0,
      };
    default:
      return state;
  }
}

export const TerminalMockup = () => {
  const [typingState, dispatchTyping] = useReducer(
    typingReducer,
    INITIAL_TYPING_STATE,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const staticLines = useMemo(
    () => terminalText.map((line) => line.replace(/_$/, "")),
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const { currentLineIndex, currentTextIndex } = typingState;

    if (currentLineIndex >= terminalText.length) return;

    const currentLine = terminalText[currentLineIndex];

    if (currentTextIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        dispatchTyping({ type: "typeChar", line: currentLine });
      }, TYPING_SPEED);

      return () => clearTimeout(timeout);
    }

    if (currentLineIndex < terminalText.length - 1) {
      const timeout = setTimeout(() => {
        dispatchTyping({ type: "nextLine" });
      }, 350);

      return () => clearTimeout(timeout);
    }
  }, [prefersReducedMotion, typingState]);

  const linesToRender = prefersReducedMotion
    ? staticLines
    : typingState.displayedLines;

  return (
    <div className="hover:shadow-emerald-500/10 relative w-full max-w-[550px] aspect-[5/4] overflow-hidden rounded-2xl border border-emerald-500/10 bg-zinc-950/75 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] [background-image:linear-gradient(to_bottom,transparent,transparent_3px,rgba(255,255,255,0.3)_4px)] [background-size:100%_6px]" />

      <div className="absolute top-0 left-0 z-10 flex h-10 w-full items-center gap-2 border-b border-white/10 bg-zinc-950/50 px-4 backdrop-blur-sm">
        <div className="size-3 rounded-full bg-red-500/80" />
        <div className="size-3 rounded-full bg-orange-400/80" />
        <div className="size-3 rounded-full bg-green-500/80" />
        <span className="flex-1 pr-10 text-center text-xs text-zinc-500">
          Terminal
        </span>
      </div>

      <div className="relative z-0 h-full px-6 pb-6 pt-14 font-mono text-sm text-emerald-400">
        <div className="space-y-2 [text-shadow:0_0_8px_rgba(16,185,129,0.22)]">
          {linesToRender.map((line, index) => {
            const isLastLine = index === terminalText.length - 1;
            const textToDisplay = isLastLine ? line.replace(/_$/, "") : line;

            const isWarning = textToDisplay.includes("[WARN]");
            const isCritical = textToDisplay.includes("[CRITICAL]");
            const isAction = textToDisplay.includes("[ACTION]");

            return (
              <p
                key={line}
                className={`flex items-start gap-1 leading-relaxed ${
                  isCritical
                    ? "text-red-400"
                    : isWarning
                      ? "text-yellow-400"
                      : isAction
                        ? "text-cyan-400"
                        : "text-emerald-400"
                }`}
              >
                <span>{textToDisplay}</span>

                {!prefersReducedMotion &&
                  isLastLine &&
                  typingState.currentLineIndex === terminalText.length - 1 && (
                    <span className="mt-0.5 inline-block h-4 w-2 bg-emerald-400 animate-pulse" />
                  )}
              </p>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>
    </div>
  );
};
