"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CaseState,
  CaseKnowledge,
  TerminalLine,
} from "@/types/game-engine";
import type { Difficulty } from "@/types/game";

type GameSessionState = {
  terminalHistory: TerminalLine[];
  currentInput: string;

  commandLog: CommandLogEntry[];
  commandStats: {
    total: number;
    success: number;
    error: number;
  };

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
  logCommand: (input: string, outcome: CommandOutcome) => void;
};

export type CommandOutcome = "success" | "error";

export type CommandLogEntry = {
  id: string;
  command: string;
  timestamp: number;
  outcome: CommandOutcome;
};

const DEFAULT_DIFFICULTY: Difficulty = "easy";

const CASE_CODES: Record<Difficulty, string> = {
  easy: "EASY-001-ACCESS-NOT-GRANTED",
  medium: "MED-002-DATA-LEAK",
  hard: "HARD-003-CRITICAL-COLLAPSE",
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
    text: "CaseShell [Versión 10.0.22631.6199]",
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

export const useGameSessionStore = create<GameSessionState>()(
  persist(
    (set) => ({
      terminalHistory: createInitialTerminalHistory(DEFAULT_DIFFICULTY),
      currentInput: "",
      commandLog: [],
      commandStats: { total: 0, success: 0, error: 0 },
      caseState: createInitialCaseState(),
      currentDifficulty: DEFAULT_DIFFICULTY,

      startTime: null,
      endTime: null,

      isVictoryOpen: false,

      initializeSession: (difficulty) =>
        set((state) => {
          // If we are changing difficulty or it's empty, reset state
          if (state.currentDifficulty !== difficulty) {
            return {
              currentDifficulty: difficulty,
              terminalHistory: createInitialTerminalHistory(difficulty),
              currentInput: "",
              caseState: createInitialCaseState(),
              startTime: null,
              endTime: null,
              isVictoryOpen: false,
              commandLog: [],
              commandStats: { total: 0, success: 0, error: 0 },
            };
          }
          return {}; // Keep existing state if difficulty matches
        }),

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
          terminalHistory: createInitialTerminalHistory(
            state.currentDifficulty,
          ),
          currentInput: "",
          caseState: createInitialCaseState(),
          startTime: null,
          endTime: null,
          isVictoryOpen: false,
          commandLog: [],
          commandStats: { total: 0, success: 0, error: 0 },
        })),

      closeVictoryModal: () => set({ isVictoryOpen: false }),

      logCommand: (command, outcome) =>
        set((state) => ({
          commandLog: [
            ...state.commandLog,
            {
              id: crypto.randomUUID(),
              command,
              outcome,
              timestamp: Date.now(),
            },
          ],
          commandStats: {
            total: state.commandStats.total + 1,
            success:
              state.commandStats.success + (outcome === "success" ? 1 : 0),
            error: state.commandStats.error + (outcome === "error" ? 1 : 0),
          },
        })),
    }),
    {
      name: "caseshell-session-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
