import type { Difficulty } from "@/features/game/types/game";
import type {
  ActiveTerminalAlert,
  AlertEffectState,
  CaseKnowledge,
  CaseProgress,
  CaseState,
  FailurePayload,
  FailureState,
  TerminalLine,
} from "@/features/game/types/game-engine";

export type GameSessionState = {
  hasHydrated: boolean;
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

  lastCompletedKey: keyof CaseProgress | null;
  completionStreak: number;

  isVictoryOpen: boolean;

  activeAlert: ActiveTerminalAlert | null;
  alertEffectState: AlertEffectState;

  failureState: FailureState;

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

  markObjectiveCompleted: (key: keyof CaseProgress) => void;
  clearLastCompletedKey: () => void;

  registerFailure: (failure: FailurePayload) => void;
  clearFailureState: () => void;

  failSession: () => void;
  closeFailedModal: () => void;
  completeSession: () => void;
  resetSession: () => void;
  closeVictoryModal: () => void;

  logCommand: (input: string, outcome: CommandOutcome) => void;

  setActiveAlert: (alert: ActiveTerminalAlert) => void;
  clearActiveAlert: () => void;

  rehydrateRuntimeTimer: () => void;
  setHasHydrated: (value: boolean) => void;
};

export type CommandOutcome = "success" | "error";

export type CommandLogEntry = {
  id: string;
  command: string;
  timestamp: number;
  outcome: CommandOutcome;
};
