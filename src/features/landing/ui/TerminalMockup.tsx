"use client";

import { useEffect, useMemo, useState } from "react";

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

export const TerminalMockup = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
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

    if (currentLineIndex >= terminalText.length) return;

    const currentLine = terminalText[currentLineIndex];

    if (currentTextIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          if (currentTextIndex === 0) next[currentLineIndex] = "";
          next[currentLineIndex] = currentLine.slice(0, currentTextIndex + 1);
          return next;
        });

        setCurrentTextIndex((prev) => prev + 1);
      }, TYPING_SPEED);

      return () => clearTimeout(timeout);
    }

    if (currentLineIndex < terminalText.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentTextIndex(0);
      }, 350);

      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentTextIndex, prefersReducedMotion]);

  const linesToRender = prefersReducedMotion ? staticLines : displayedLines;

  return (
    <div className="hover:shadow-emerald-500/10 relative w-full max-w-[550px] aspect-[5/4] overflow-hidden rounded-2xl border border-emerald-500/10 bg-black/75 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] [background-image:linear-gradient(to_bottom,transparent,transparent_3px,rgba(255,255,255,0.3)_4px)] [background-size:100%_6px]" />

      <div className="absolute top-0 left-0 z-10 flex h-10 w-full items-center gap-2 border-b border-white/10 bg-black/50 px-4 backdrop-blur-sm">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-orange-400/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="flex-1 pr-10 text-center text-xs text-slate-500">
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
                key={index}
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
                  currentLineIndex === terminalText.length - 1 && (
                    <span className="mt-0.5 inline-block h-4 w-2 bg-emerald-400 animate-pulse" />
                  )}
              </p>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
    </div>
  );
};
