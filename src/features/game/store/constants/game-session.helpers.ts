import { getGameCaseOrDefault } from "@/features/game/data/cases";
import {
  ALERT_EFFECT_MAP,
  INITIAL_ALERT_EFFECT_STATE,
} from "@/features/game/store/constants/game-session.constants";
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

export const createInitialFailureState = (caseId: string): FailureState => ({
  strikes: 0,
  maxStrikes: getGameCaseOrDefault(caseId).maxStrikes,
  reason: null,
  isLockedOut: false,
  failureType: null,
});

export const createInitialTerminalHistory = (
  caseId: string,
): TerminalLine[] => [
  {
    id: crypto.randomUUID(),
    type: "system",
    text: "CaseShell [Versión 10.0.22631.6199]",
  },
  {
    id: crypto.randomUUID(),
    type: "system",
    text: `Caso asignado: ${getGameCaseOrDefault(caseId).code}`,
  },
  {
    id: crypto.randomUUID(),
    type: "system",
    text: "Escribe 'help' para ver comandos disponibles.",
  },
];
