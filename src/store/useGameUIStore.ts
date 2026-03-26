"use client";

import { create } from "zustand";
import type {
  Difficulty,
  FileType,
  WindowInstance,
  WindowPosition,
  WindowSize,
} from "@/types/game";

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
  alertSoundsEnabled: boolean;
  exitModalOpen: boolean;
  resetModalOpen: boolean;
  crtOverlayEnabled: boolean;

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
  setAlertSoundsEnabled: (enabled: boolean) => void;
  toggleAlertSounds: () => void;
  openExitModal: () => void;
  closeExitModal: () => void;
  openResetModal: () => void;
  closeResetModal: () => void;
  setCrtOverlayEnabled: (enabled: boolean) => void;
  toggleCrtOverlay: () => void;

  openWindow: (
    window: Omit<WindowInstance, "zIndex" | "position" | "size"> & {
      position?: WindowPosition;
      size?: WindowSize;
    },
  ) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  setWindowPosition: (id: string, position: WindowPosition) => void;
  setWindowSize: (id: string, size: WindowSize) => void;
};

export type WallpaperTheme = "aurora" | "ocean" | "matrix";

const BASE_WINDOW_POSITION: WindowPosition = { x: 120, y: 120 };
const WINDOW_OFFSET = 28;
const DEFAULT_WINDOW_SIZES: Record<FileType, WindowSize> = {
  text: { width: 640, height: 460 },
  image: { width: 640, height: 520 },
  folder: { width: 720, height: 520 },
  terminal: { width: 860, height: 560 },
  chat: { width: 440, height: 520 },
};

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
  alertSoundsEnabled: true,
  exitModalOpen: false,
  resetModalOpen: false,
  crtOverlayEnabled: true,

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
  setAlertSoundsEnabled: (enabled) => set({ alertSoundsEnabled: enabled }),
  toggleAlertSounds: () =>
    set((state) => ({ alertSoundsEnabled: !state.alertSoundsEnabled })),
  openExitModal: () => set({ exitModalOpen: true }),
  closeExitModal: () => set({ exitModalOpen: false }),
  openResetModal: () => set({ resetModalOpen: true }),
  closeResetModal: () => set({ resetModalOpen: false }),
  setCrtOverlayEnabled: (enabled) => set({ crtOverlayEnabled: enabled }),
  toggleCrtOverlay: () =>
    set((state) => ({ crtOverlayEnabled: !state.crtOverlayEnabled })),

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

    const defaultPosition = window.position ?? {
      x: BASE_WINDOW_POSITION.x + WINDOW_OFFSET * openWindows.length,
      y: BASE_WINDOW_POSITION.y + WINDOW_OFFSET * openWindows.length,
    };
    const defaultSize = window.size ??
      DEFAULT_WINDOW_SIZES[window.type] ?? {
        width: 640,
        height: 460,
      };

    set({
      openWindows: [
        ...openWindows,
        {
          ...window,
          zIndex: zCounter + 1,
          position: defaultPosition,
          size: defaultSize,
        },
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
  setWindowSize: (id, size) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) =>
        w.id === id ? { ...w, size } : w,
      ),
    })),
}));
