import type {
  AlertEffectId,
  AlertEffectState,
} from "@/features/game/types/game-engine";

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
