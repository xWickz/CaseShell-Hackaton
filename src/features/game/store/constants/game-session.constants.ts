import type { Difficulty } from "@/features/game/types/game";
import type {
  AlertEffectId,
  AlertEffectState,
} from "@/features/game/types/game-engine";

export const DEFAULT_DIFFICULTY: Difficulty = "easy";

export const CASE_CODES: Record<Difficulty, string> = {
  easy: "EASY-001-ACCESS-NOT-GRANTED",
  medium: "MED-002-DATA-LEAK",
  hard: "HARD-003-CRITICAL-COLLAPSE",
};

export const DIFFICULTY_TIME_LIMITS: Record<Difficulty, number> = {
  easy: 20 * 60 * 1000,
  medium: 15 * 60 * 1000,
  hard: 10 * 60 * 1000,
};

export const DIFFICULTY_MAX_STRIKES: Record<Difficulty, number> = {
  easy: 3,
  medium: 3,
  hard: 2,
};

export const MAX_COMMAND_HISTORY = 50;

export const INITIAL_ALERT_EFFECT_STATE: AlertEffectState = {
  filesystemLocked: false,
  screenObscured: false,
  labelsScrambled: false,
};

export const ALERT_EFFECT_MAP: Record<AlertEffectId, AlertEffectState> = {
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
