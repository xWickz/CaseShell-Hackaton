"use client";

import { useEffect, useMemo, useState } from "react";

const TYPING_SPEED = 20;

const terminalText = [
  "agent@cubepath:~$ diag --system",
  "> [OK] Database synced",
  "> [OK] Firewall active",
  "> [WARN] Integrity check failed in: /var/log/syslog.4",
  "> Use 'submit' to report findings.",
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

    if (currentLineIndex < terminalText.length) {
      const currentLine = terminalText[currentLineIndex];

      if (currentTextIndex < currentLine.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const nextLines = [...prev];
            if (currentTextIndex === 0) nextLines[currentLineIndex] = "";
            nextLines[currentLineIndex] = currentLine.substring(
              0,
              currentTextIndex + 1,
            );
            return nextLines;
          });
          setCurrentTextIndex((prev) => prev + 1);
        }, TYPING_SPEED);

        return () => clearTimeout(timeout);
      }

      if (currentLineIndex < terminalText.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentTextIndex(0);
        }, 400);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentTextIndex, prefersReducedMotion]);

  const linesToRender = prefersReducedMotion ? staticLines : displayedLines;

  return (
    <div className="w-full max-w-137.5 aspect-[5/4] bg-black/70 rounded-2xl border border-white/10 shadow-2xl p-6 font-mono text-emerald-400 text-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-black/40 border-b border-white/10 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-orange-400/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="text-slate-500 text-xs flex-1 text-center pr-10">
          CaseShell Terminal v0.1
        </span>
      </div>

      <div className="pt-8 space-y-2.5">
        {linesToRender.map((line, index) => {
          const isLastLine = index === terminalText.length - 1;
          const textToDisplay = isLastLine ? line.slice(0, -1) : line;

          return (
            <p key={index} className="flex items-start gap-1">
              <span className="leading-relaxed">{textToDisplay}</span>
              {!prefersReducedMotion &&
                isLastLine &&
                currentLineIndex === terminalText.length - 1 && (
                <span className="w-2 h-4 bg-emerald-400 animate-pulse mt-0.5" />
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
};
