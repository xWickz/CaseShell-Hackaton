"use client";

import { useCallback, useRef } from "react";
import type { CommandOutcome } from "@/store/useGameSessionStore";

function createContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    return new (Ctor ?? AudioContext)();
  } catch (error) {
    console.warn("AudioContext no disponible", error);
    return null;
  }
}

export function useTerminalAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createContext();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration = 0.12) => {
      const ctx = getContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.12;

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      oscillator.start(now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.stop(now + duration);
    },
    [getContext],
  );

  const playOutcome = useCallback(
    (outcome: CommandOutcome) => {
      if (outcome === "success") {
        playTone(880, 0.08);
      } else {
        playTone(220, 0.2);
      }
    },
    [playTone],
  );

  const playCompletion = useCallback(() => {
    playTone(660, 0.15);
    setTimeout(() => playTone(990, 0.2), 90);
  }, [playTone]);

  return { playOutcome, playCompletion };
}
