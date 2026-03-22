"use client";

import { create } from "zustand";
import type { Difficulty, WindowInstance, WindowPosition } from "@/types/game";

type GameUIState = {
  briefingOpen: boolean;
  hasSeenOnboarding: boolean;
  selectedDifficulty: Difficulty | null;
  openWindows: WindowInstance[];
  zCounter: number;
  wallpaperTheme: WallpaperTheme;
  iconPositions: Record<string, { x: number; y: number }>;
  objectivePanelVisible: boolean;
  objectivePanelCollapsed: boolean;

  closeBriefing: () => void;
  completeOnboarding: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setWallpaperTheme: (theme: WallpaperTheme) => void;
  cycleWallpaperTheme: () => void;
  setIconPosition: (id: string, position: { x: number; y: number }) => void;
  openObjectivePanel: () => void;
  closeObjectivePanel: () => void;
  toggleObjectivePanelCollapsed: () => void;
  setObjectivePanelCollapsed: (collapsed: boolean) => void;

  openWindow: (
    window: Omit<WindowInstance, "zIndex" | "position"> & {
      position?: WindowPosition;
    },
  ) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  setWindowPosition: (id: string, position: WindowPosition) => void;
};

export type WallpaperTheme = "aurora" | "ocean" | "matrix";

const BASE_WINDOW_POSITION: WindowPosition = { x: 120, y: 120 };
const WINDOW_OFFSET = 28;

export const useGameUIStore = create<GameUIState>((set, get) => ({
  briefingOpen: true,
  hasSeenOnboarding: false,
  selectedDifficulty: null,
  openWindows: [],
  zCounter: 10,
  wallpaperTheme: "aurora",
  iconPositions: {},
  objectivePanelVisible: true,
  objectivePanelCollapsed: false,

  closeBriefing: () => set({ briefingOpen: false }),
  completeOnboarding: () => set({ hasSeenOnboarding: true }),

  setDifficulty: (difficulty) =>
    set({ selectedDifficulty: difficulty, iconPositions: {} }),

  setWallpaperTheme: (theme) => set({ wallpaperTheme: theme }),
  cycleWallpaperTheme: () =>
    set((state) => {
      const nextOrder: WallpaperTheme[] = ["aurora", "ocean", "matrix"];
      const currentIndex = nextOrder.indexOf(state.wallpaperTheme);
      const nextTheme = nextOrder[(currentIndex + 1) % nextOrder.length];
      return { wallpaperTheme: nextTheme };
    }),

  setIconPosition: (id, position) =>
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        [id]: position,
      },
    })),

  openObjectivePanel: () =>
    set({ objectivePanelVisible: true, objectivePanelCollapsed: false }),
  closeObjectivePanel: () => set({ objectivePanelVisible: false }),
  toggleObjectivePanelCollapsed: () =>
    set((state) => ({
      objectivePanelCollapsed: !state.objectivePanelCollapsed,
      objectivePanelVisible: true,
    })),
  setObjectivePanelCollapsed: (collapsed) =>
    set({ objectivePanelCollapsed: collapsed }),

  openWindow: (window) => {
    // Lines 60-84 omitted
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

    const defaultPosition = window.position ?? {
      x: BASE_WINDOW_POSITION.x + WINDOW_OFFSET * openWindows.length,
      y: BASE_WINDOW_POSITION.y + WINDOW_OFFSET * openWindows.length,
    };

    set({
      openWindows: [
        ...openWindows,
        { ...window, zIndex: zCounter + 1, position: defaultPosition },
      ],
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

  setWindowPosition: (id, position) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === id ? { ...w, position } : w,
      ),
    })),
}));
