"use client";

import { create } from "zustand";
import type { Difficulty, WindowInstance } from "@/types/game";

type GameUIState = {
  briefingOpen: boolean;
  selectedDifficulty: Difficulty | null;
  openWindows: WindowInstance[];
  zCounter: number;

  closeBriefing: () => void;
  setDifficulty: (difficulty: Difficulty) => void;

  openWindow: (window: Omit<WindowInstance, "zIndex">) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
};

export const useGameUIStore = create<GameUIState>((set, get) => ({
  briefingOpen: true,
  selectedDifficulty: null,
  openWindows: [],
  zCounter: 10,

  closeBriefing: () => set({ briefingOpen: false }),

  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

  openWindow: (window) => {
    const { openWindows, zCounter } = get();

    const existing = openWindows.find((w) => w.id === window.id);

    if (existing) {
      set({
        openWindows: openWindows.map((w) =>
          w.id === window.id ? { ...w, zIndex: zCounter + 1 } : w,
        ),
        zCounter: zCounter + 1,
      });
      return;
    }

    set({
      openWindows: [...openWindows, { ...window, zIndex: zCounter + 1 }],
      zCounter: zCounter + 1,
    });
  },

  closeWindow: (id) =>
    set((state) => ({
      openWindows: state.openWindows.filter((w) => w.id !== id),
    })),

  focusWindow: (id) => {
    const { openWindows, zCounter } = get();

    set({
      openWindows: openWindows.map((w) =>
        w.id === id ? { ...w, zIndex: zCounter + 1 } : w,
      ),
      zCounter: zCounter + 1,
    });
  },
}));
