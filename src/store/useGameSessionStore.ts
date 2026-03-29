"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CaseState,
  CaseKnowledge,
  TerminalLine,
  ActiveTerminalAlert,
  AlertEffectState,
  AlertEffectId,
} from "@/types/game-engine";
import type { Difficulty } from "@/types/game";

type GameSessionState = {
  terminalHistory: TerminalLine[];
  currentInput: string;

  commandLog: CommandLogEntry[];
  commandHistory: string[];
  commandStats: {
    total: number;
    success: number;
    error: number;
  };

  caseState: CaseState;
  currentDifficulty: Difficulty;

  startTime: number | null;
  endTime: number | null;

  timeLimitMs: number;
  timeRemainingMs: number;
  timerEndsAt: number | null;
  hasTimedOut: boolean;
  isFailedOpen: boolean;

  isPaused: boolean;
  pausedAt: number | null;

  isVictoryOpen: boolean;

  activeAlert: ActiveTerminalAlert | null;
  alertEffectState: AlertEffectState;

  setCurrentInput: (value: string) => void;
  addTerminalLines: (lines: TerminalLine[]) => void;
  clearTerminalHistory: () => void;

  initializeSession: (difficulty: Difficulty) => void;
  setCaseState: (updater: Partial<CaseState>) => void;
  discoverKnowledge: (key: keyof CaseKnowledge) => void;
  startSession: () => void;
  updateTimeRemaining: (now: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  failSession: () => void;
  closeFailedModal: () => void;
  completeSession: () => void;
  resetSession: () => void;
  closeVictoryModal: () => void;
  logCommand: (input: string, outcome: CommandOutcome) => void;
  setActiveAlert: (alert: ActiveTerminalAlert) => void;
  clearActiveAlert: () => void;
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

const DIFFICULTY_TIME_LIMITS: Record<Difficulty, number> = {
  easy: 30 * 60 * 1000,
  medium: 20 * 60 * 1000,
  hard: 10 * 60 * 1000,
};

const MAX_COMMAND_HISTORY = 50;

const INITIAL_ALERT_EFFECT_STATE: AlertEffectState = {
  filesystemLocked: false,
  screenObscured: false,
  labelsScrambled: false,
};

const ALERT_EFFECT_MAP: Record<AlertEffectId, AlertEffectState> = {
  "filesystem-lock": {
    filesystemLocked: true,
    screenObscured: false,
    labelsScrambled: false,
  },
  "screen-obscure": {
    filesystemLocked: false,
    screenObscured: true,
    labelsScrambled: false,
  },
  "scramble-labels": {
    filesystemLocked: false,
    screenObscured: false,
    labelsScrambled: true,
  },
};

const createAlertEffectState = (effect?: AlertEffectId | null) => {
  if (!effect) return { ...INITIAL_ALERT_EFFECT_STATE };
  return { ...INITIAL_ALERT_EFFECT_STATE, ...ALERT_EFFECT_MAP[effect] };
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
      commandHistory: [],
      commandStats: { total: 0, success: 0, error: 0 },
      caseState: createInitialCaseState(),
      currentDifficulty: DEFAULT_DIFFICULTY,

      startTime: null,
      endTime: null,

      timeLimitMs: DIFFICULTY_TIME_LIMITS[DEFAULT_DIFFICULTY],
      timeRemainingMs: DIFFICULTY_TIME_LIMITS[DEFAULT_DIFFICULTY],
      timerEndsAt: null,
      hasTimedOut: false,
      isFailedOpen: false,

      isPaused: false,
      pausedAt: null,

      isVictoryOpen: false,

      activeAlert: null,
      alertEffectState: { ...INITIAL_ALERT_EFFECT_STATE },

      initializeSession: (difficulty) =>
        set((state) => {
          if (state.currentDifficulty !== difficulty) {
            const nextTimeLimit = DIFFICULTY_TIME_LIMITS[difficulty];

            return {
              currentDifficulty: difficulty,
              terminalHistory: createInitialTerminalHistory(difficulty),
              currentInput: "",
              caseState: createInitialCaseState(),
              startTime: null,
              endTime: null,

              timeLimitMs: nextTimeLimit,
              timeRemainingMs: nextTimeLimit,
              timerEndsAt: null,
              hasTimedOut: false,
              isFailedOpen: false,

              isPaused: false,
              pausedAt: null,

              isVictoryOpen: false,
              commandLog: [],
              commandHistory: [],
              commandStats: { total: 0, success: 0, error: 0 },
              activeAlert: null,
              alertEffectState: { ...INITIAL_ALERT_EFFECT_STATE },
            };
          }
          return {};
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
        set((state) => {
          if (
            state.startTime ||
            state.caseState.progress.completed ||
            state.hasTimedOut
          ) {
            return {};
          }

          const now = Date.now();
          return {
            startTime: now,
            timerEndsAt: now + state.timeLimitMs,
            timeRemainingMs: state.timeLimitMs,
            isPaused: false,
            pausedAt: null,
          };
        }),

      updateTimeRemaining: (now) =>
        set((state) => {
          if (
            !state.startTime ||
            !state.timerEndsAt ||
            state.caseState.progress.completed ||
            state.hasTimedOut ||
            state.isPaused
          ) {
            return {};
          }

          const remaining = Math.max(0, state.timerEndsAt - now);

          if (remaining <= 0) {
            return {
              timeRemainingMs: 0,
              hasTimedOut: true,
              isFailedOpen: true,
              endTime: state.endTime ?? now,
              activeAlert: null,
              alertEffectState: createAlertEffectState(null),
              isPaused: false,
              pausedAt: null,
            };
          }

          if (remaining === state.timeRemainingMs) {
            return {};
          }

          return {
            timeRemainingMs: remaining,
          };
        }),

      pauseSession: () =>
        set((state) => {
          if (
            !state.startTime ||
            state.caseState.progress.completed ||
            state.hasTimedOut ||
            state.isPaused
          ) {
            return {};
          }

          return {
            isPaused: true,
            pausedAt: Date.now(),
          };
        }),

      resumeSession: () =>
        set((state) => {
          if (
            !state.isPaused ||
            !state.pausedAt ||
            !state.startTime ||
            !state.timerEndsAt ||
            state.caseState.progress.completed ||
            state.hasTimedOut
          ) {
            return {};
          }

          const now = Date.now();
          const pauseDuration = Math.max(0, now - state.pausedAt);

          return {
            isPaused: false,
            pausedAt: null,
            startTime: state.startTime + pauseDuration,
            timerEndsAt: state.timerEndsAt + pauseDuration,
          };
        }),

      failSession: () =>
        set((state) => {
          if (state.caseState.progress.completed || state.hasTimedOut)
            return {};

          const now = Date.now();

          return {
            timeRemainingMs: 0,
            hasTimedOut: true,
            isFailedOpen: true,
            endTime: state.endTime ?? now,
            activeAlert: null,
            alertEffectState: createAlertEffectState(null),
            isPaused: false,
            pausedAt: null,
          };
        }),

      closeFailedModal: () => set({ isFailedOpen: false }),

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
          activeAlert: null,
          alertEffectState: createAlertEffectState(null),
          isPaused: false,
          pausedAt: null,
        })),

      resetSession: () =>
        set((state) => {
          const nextTimeLimit = DIFFICULTY_TIME_LIMITS[state.currentDifficulty];

          return {
            terminalHistory: createInitialTerminalHistory(
              state.currentDifficulty,
            ),
            currentInput: "",
            caseState: createInitialCaseState(),
            startTime: null,
            endTime: null,

            timeLimitMs: nextTimeLimit,
            timeRemainingMs: nextTimeLimit,
            timerEndsAt: null,
            hasTimedOut: false,
            isFailedOpen: false,

            isPaused: false,
            pausedAt: null,

            isVictoryOpen: false,
            commandLog: [],
            commandHistory: [],
            commandStats: { total: 0, success: 0, error: 0 },
            activeAlert: null,
            alertEffectState: { ...INITIAL_ALERT_EFFECT_STATE },
          };
        }),

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
          commandHistory: [...state.commandHistory, command].slice(
            -MAX_COMMAND_HISTORY,
          ),
          commandStats: {
            total: state.commandStats.total + 1,
            success:
              state.commandStats.success + (outcome === "success" ? 1 : 0),
            error: state.commandStats.error + (outcome === "error" ? 1 : 0),
          },
        })),

      setActiveAlert: (alert) =>
        set({
          activeAlert: alert,
          alertEffectState: createAlertEffectState(alert?.effect ?? null),
        }),

      clearActiveAlert: () =>
        set({
          activeAlert: null,
          alertEffectState: createAlertEffectState(null),
        }),
    }),
    {
      name: "caseshell-session-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        terminalHistory: state.terminalHistory,
        currentInput: state.currentInput,
        commandLog: state.commandLog,
        commandHistory: state.commandHistory,
        commandStats: state.commandStats,
        caseState: state.caseState,
        currentDifficulty: state.currentDifficulty,
        startTime: state.startTime,
        endTime: state.endTime,
        timeLimitMs: state.timeLimitMs,
        timeRemainingMs: state.timeRemainingMs,
        timerEndsAt: state.timerEndsAt,
        hasTimedOut: state.hasTimedOut,
        isFailedOpen: state.isFailedOpen,
        isPaused: state.isPaused,
        pausedAt: state.pausedAt,
        isVictoryOpen: state.isVictoryOpen,
        activeAlert: state.activeAlert,
        alertEffectState: state.alertEffectState,
      }),
    },
  ),
);
