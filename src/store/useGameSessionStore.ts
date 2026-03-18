"use client";

import { create } from "zustand";
import type {
  EasyCaseState,
  EasyCaseKnowledge,
  TerminalLine,
} from "@/types/game-engine";

type GameSessionState = {
  terminalHistory: TerminalLine[];
  currentInput: string;

  caseState: EasyCaseState;

  startTime: number | null;
  endTime: number | null;

  isVictoryOpen: boolean;

  setCurrentInput: (value: string) => void;
  addTerminalLines: (lines: TerminalLine[]) => void;
  clearTerminalHistory: () => void;

  setCaseState: (updater: Partial<EasyCaseState>) => void;
  discoverKnowledge: (
    key: "knowsWifiFix" | "knowsFirewallFix" | "knowsMalwareFix",
  ) => void;
  startSession: () => void;
  completeSession: () => void;
  resetSession: () => void;
  closeVictoryModal: () => void;
};

const initialCaseState: EasyCaseState = {
  knowledge: {
    knowsWifiFix: false,
    knowsFirewallFix: false,
    knowsMalwareFix: false,
  },
  progress: {
    wifiFixed: false,
    firewallFixed: false,
    malwareKilled: false,
    completed: false,
  },
};

const initialTerminalHistory: TerminalLine[] = [
  {
    id: crypto.randomUUID(),
    type: "system",
    text: "CubePath VPS Training Terminal v0.1",
  },
  {
    id: crypto.randomUUID(),
    type: "system",
    text: "Escribe 'help' para ver comandos disponibles.",
  },
];

export const useGameSessionStore = create<GameSessionState>((set) => ({
  terminalHistory: initialTerminalHistory,
  currentInput: "",
  caseState: initialCaseState,

  startTime: null,
  endTime: null,

  isVictoryOpen: false,

  setCurrentInput: (value) => set({ currentInput: value }),

  addTerminalLines: (lines) =>
    set((state) => ({
      terminalHistory: [...state.terminalHistory, ...lines],
    })),

  clearTerminalHistory: () =>
    set({
      terminalHistory: [
        {
          id: crypto.randomUUID(),
          type: "system",
          text: "Terminal limpiada.",
        },
      ],
    }),

  setCaseState: (updater) =>
    set((state) => ({
      caseState: {
        ...state.caseState,
        ...updater,
        knowledge: {
          ...state.caseState.knowledge,
          ...(updater.knowledge ?? {}),
        },
        progress: {
          ...state.caseState.progress,
          ...(updater.progress ?? {}),
        },
      },
    })),

  discoverKnowledge: (key) =>
    set((state) => ({
      caseState: {
        ...state.caseState,
        knowledge: {
          ...state.caseState.knowledge,
          [key]: true,
        },
      },
    })),

  startSession: () =>
    set((state) => ({
      startTime: state.startTime ?? Date.now(),
    })),

  completeSession: () =>
    set((state) => ({
      endTime: state.endTime ?? Date.now(),
      isVictoryOpen: true,
      caseState: {
        ...state.caseState,
        progress: {
          ...state.caseState.progress,
          completed: true,
        },
      },
    })),

  resetSession: () =>
    set({
      terminalHistory: [
        {
          id: crypto.randomUUID(),
          type: "system",
          text: "CubePath VPS Training Terminal v0.1",
        },
        {
          id: crypto.randomUUID(),
          type: "system",
          text: "Escribe 'help' para ver comandos disponibles.",
        },
      ],
      currentInput: "",
      caseState: initialCaseState,
      startTime: null,
      endTime: null,
      isVictoryOpen: false,
    }),

  closeVictoryModal: () => set({ isVictoryOpen: false }),
}));
