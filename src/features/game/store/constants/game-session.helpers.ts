import {
  ALERT_EFFECT_MAP,
  CASE_CODES,
  DIFFICULTY_MAX_STRIKES,
  INITIAL_ALERT_EFFECT_STATE,
} from "@/features/game/store/constants/game-session.constants";
import type { Difficulty } from "@/features/game/types/game";
import type {
  AlertEffectId,
  CaseState,
  FailureState,
  TerminalLine,
} from "@/features/game/types/game-engine";

export const createAlertEffectState = (effect?: AlertEffectId | null) => {
  if (!effect) return { ...INITIAL_ALERT_EFFECT_STATE };
  return { ...INITIAL_ALERT_EFFECT_STATE, ...ALERT_EFFECT_MAP[effect] };
};

export const createInitialCaseState = (): CaseState => ({
  knowledge: {},
  progress: { completed: false },
});

export const createInitialFailureState = (
  difficulty: Difficulty,
): FailureState => ({
  strikes: 0,
  maxStrikes: DIFFICULTY_MAX_STRIKES[difficulty],
  reason: null,
  isLockedOut: false,
  failureType: null,
});

export const createInitialTerminalHistory = (
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
