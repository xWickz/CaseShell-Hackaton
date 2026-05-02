"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY_TIME_LIMITS,
  INITIAL_ALERT_EFFECT_STATE,
  MAX_COMMAND_HISTORY,
} from "@/features/game/store/constants/game-session.constants";
import {
  createAlertEffectState,
  createInitialCaseState,
  createInitialFailureState,
  createInitialTerminalHistory,
} from "@/features/game/store/constants/game-session.helpers";
import type { GameSessionState } from "@/features/game/store/constants/game-session.types";
import { useGameUIStore } from "@/features/game/store/useGameUIStore";

export const useGameSessionStore = create<GameSessionState>()(
  persist(
    (set) => ({
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      rehydrateRuntimeTimer: () =>
        set((state) => {
          const isCompleted = state.caseState.progress.completed;
          const isLockedOut = state.failureState.isLockedOut;

          if (
            isCompleted ||
            state.hasTimedOut ||
            isLockedOut ||
            state.timeRemainingMs <= 0
          ) {
            return {
              startTime: null,
              endTime: null,
              timerEndsAt: null,
              isVictoryOpen: false,
            };
          }

          const now = Date.now();

          return {
            startTime: now,
            endTime: null,
            timerEndsAt: state.isPaused ? null : now + state.timeRemainingMs,
            isVictoryOpen: false,
          };
        }),

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

      lastCompletedKey: null,
      completionStreak: 0,

      isVictoryOpen: false,

      activeAlert: null,
      alertEffectState: { ...INITIAL_ALERT_EFFECT_STATE },

      failureState: createInitialFailureState(DEFAULT_DIFFICULTY),

      initializeSession: (difficulty) =>
        set(() => {
          useGameUIStore.getState().resetVirusAlertHint();

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

            lastCompletedKey: null,
            completionStreak: 0,

            isVictoryOpen: false,
            commandLog: [],
            commandHistory: [],
            commandStats: { total: 0, success: 0, error: 0 },
            activeAlert: null,
            alertEffectState: { ...INITIAL_ALERT_EFFECT_STATE },
            failureState: createInitialFailureState(difficulty),
          };
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
            state.hasTimedOut ||
            state.failureState.isLockedOut
          ) {
            return {};
          }

          const now = Date.now();
          const remaining =
            state.timeRemainingMs > 0
              ? state.timeRemainingMs
              : state.timeLimitMs;

          return {
            startTime: now,
            endTime: null,
            timerEndsAt: now + remaining,
            timeRemainingMs: remaining,
            isPaused: false,
            pausedAt: null,
            isVictoryOpen: false,
          };
        }),

      updateTimeRemaining: (now) =>
        set((state) => {
          if (
            !state.startTime ||
            !state.timerEndsAt ||
            state.caseState.progress.completed ||
            state.hasTimedOut ||
            state.isPaused ||
            state.failureState.isLockedOut
          ) {
            return {};
          }

          const remaining = Math.max(0, state.timerEndsAt - now);

          if (remaining <= 0) {
            useGameUIStore.getState().resetVirusAlertHint();

            return {
              timeRemainingMs: 0,
              hasTimedOut: true,
              isFailedOpen: true,
              endTime: state.endTime ?? now,
              activeAlert: null,
              alertEffectState: createAlertEffectState(null),
              isPaused: false,
              pausedAt: null,
              failureState: {
                ...state.failureState,
                reason:
                  "No lograste contener el incidente dentro del tiempo asignado.",
                isLockedOut: true,
                failureType: "timeout",
              },
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
            state.isPaused ||
            state.failureState.isLockedOut
          ) {
            return {};
          }

          const now = Date.now();
          const remaining = state.timerEndsAt
            ? Math.max(0, state.timerEndsAt - now)
            : state.timeRemainingMs;

          return {
            isPaused: true,
            pausedAt: now,
            timeRemainingMs: remaining,
            timerEndsAt: null,
          };
        }),

      resumeSession: () =>
        set((state) => {
          if (
            !state.isPaused ||
            state.caseState.progress.completed ||
            state.hasTimedOut ||
            state.failureState.isLockedOut ||
            state.timeRemainingMs <= 0
          ) {
            return {};
          }

          const now = Date.now();

          return {
            isPaused: false,
            pausedAt: null,
            timerEndsAt: now + state.timeRemainingMs,
          };
        }),

      markObjectiveCompleted: (key) =>
        set((state) => ({
          lastCompletedKey: key,
          completionStreak:
            state.lastCompletedKey === key
              ? state.completionStreak
              : state.completionStreak + 1,
        })),

      clearLastCompletedKey: () => set({ lastCompletedKey: null }),

      registerFailure: (failure) =>
        set((state) => {
          if (
            state.caseState.progress.completed ||
            state.hasTimedOut ||
            state.failureState.isLockedOut
          ) {
            return {};
          }

          const nextStrikes = failure.strike
            ? state.failureState.strikes + 1
            : state.failureState.strikes;

          const reachedMaxStrikes =
            failure.strike && nextStrikes >= state.failureState.maxStrikes;

          const shouldLockout = Boolean(failure.lockout || reachedMaxStrikes);
          const now = Date.now();

          if (shouldLockout) {
            useGameUIStore.getState().resetVirusAlertHint();
          }

          return {
            endTime: shouldLockout && !state.endTime ? now : state.endTime,
            isFailedOpen: shouldLockout ? true : state.isFailedOpen,
            hasTimedOut: shouldLockout ? true : state.hasTimedOut,
            activeAlert: shouldLockout ? null : state.activeAlert,
            alertEffectState: createAlertEffectState(
              failure.effect ?? (shouldLockout ? "screen-obscure" : null),
            ),
            failureState: {
              ...state.failureState,
              strikes: nextStrikes,
              reason: failure.reason,
              isLockedOut: shouldLockout,
              failureType: "command",
            },
            isPaused: false,
            pausedAt: null,
          };
        }),

      clearFailureState: () =>
        set((state) => ({
          failureState: createInitialFailureState(state.currentDifficulty),
        })),

      failSession: () =>
        set((state) => {
          if (
            state.caseState.progress.completed ||
            state.hasTimedOut ||
            state.failureState.isLockedOut
          ) {
            return {};
          }

          useGameUIStore.getState().resetVirusAlertHint();

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
            failureState: {
              ...state.failureState,
              reason: "La sesión terminó por una condición de fallo.",
              isLockedOut: true,
              failureType: "command",
            },
          };
        }),

      closeFailedModal: () => set({ isFailedOpen: false }),

      completeSession: () =>
        set((state) => {
          useGameUIStore.getState().resetVirusAlertHint();

          return {
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
          };
        }),

      resetSession: () =>
        set((state) => {
          useGameUIStore.getState().resetVirusAlertHint();

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

            lastCompletedKey: null,
            completionStreak: 0,

            isVictoryOpen: false,
            commandLog: [],
            commandHistory: [],
            commandStats: { total: 0, success: 0, error: 0 },
            activeAlert: null,
            alertEffectState: { ...INITIAL_ALERT_EFFECT_STATE },
            failureState: createInitialFailureState(state.currentDifficulty),
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        terminalHistory: state.terminalHistory,
        currentInput: state.currentInput,
        commandLog: state.commandLog,
        commandHistory: state.commandHistory,
        commandStats: state.commandStats,

        caseState: {
          knowledge: state.caseState.knowledge,
          progress: {
            ...state.caseState.progress,
            completed: false,
          },
        },

        currentDifficulty: state.currentDifficulty,

        timeLimitMs: state.timeLimitMs,
        timeRemainingMs: state.timeRemainingMs,

        hasTimedOut: state.hasTimedOut,
        isFailedOpen: state.isFailedOpen,

        isPaused: state.isPaused,
        pausedAt: null,

        lastCompletedKey: state.lastCompletedKey,
        completionStreak: state.completionStreak,

        activeAlert: state.activeAlert,
        alertEffectState: state.alertEffectState,

        failureState: state.failureState,
      }),
    },
  ),
);
