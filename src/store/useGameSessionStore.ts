"use client";

import { create } from "zustand";
import type { CaseState, CaseKnowledge, TerminalLine } from "@/types/game-engine";
import type { Difficulty } from "@/types/game";

type GameSessionState = {
  terminalHistory: TerminalLine[];
  currentInput: string;

  caseState: CaseState;
  currentDifficulty: Difficulty;

  startTime: number | null;
  endTime: number | null;

  isVictoryOpen: boolean;

  setCurrentInput: (value: string) => void;
  addTerminalLines: (lines: TerminalLine[]) => void;
  clearTerminalHistory: () => void;

  initializeSession: (difficulty: Difficulty) => void;
  setCaseState: (updater: Partial<CaseState>) => void;
  discoverKnowledge: (key: keyof CaseKnowledge) => void;
  startSession: () => void;
  completeSession: () => void;
  resetSession: () => void;
  closeVictoryModal: () => void;
};

const DEFAULT_DIFFICULTY: Difficulty = "easy";

const CASE_CODES: Record<Difficulty, string> = {
  easy: "EASY-001",
  medium: "MED-002",
  hard: "HARD-003",
};

const createInitialCaseState = (): CaseState => ({
  knowledge: {},
  progress: { completed: false },
});

const createInitialTerminalHistory = (
  difficulty: Difficulty,
): TerminalLine[] => [
  {
    id: crypto.randomUUID(),
    type: "system",
    text: "CubePath VPS Training Terminal v0.1",
  },
  {
    id: crypto.randomUUID(),
    type: "system",
    text: `Caso asignado: ${CASE_CODES[difficulty]}`,
  },
  {
    id: crypto.randomUUID(),
    type: "system",
    text: "Escribe 'help' para ver comandos disponibles.",
  },
];

export const useGameSessionStore = create<GameSessionState>((set) => ({
  terminalHistory: createInitialTerminalHistory(DEFAULT_DIFFICULTY),
  currentInput: "",
  caseState: createInitialCaseState(),
  currentDifficulty: DEFAULT_DIFFICULTY,

  startTime: null,
  endTime: null,

  isVictoryOpen: false,

  initializeSession: (difficulty) =>
    set(() => ({
      currentDifficulty: difficulty,
      terminalHistory: createInitialTerminalHistory(difficulty),
      currentInput: "",
      caseState: createInitialCaseState(),
      startTime: null,
      endTime: null,
      isVictoryOpen: false,
    })),

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
    set((state) => ({
      terminalHistory: createInitialTerminalHistory(state.currentDifficulty),
      currentInput: "",
      caseState: createInitialCaseState(),
      startTime: null,
      endTime: null,
      isVictoryOpen: false,
    })),

  closeVictoryModal: () => set({ isVictoryOpen: false }),
}));
