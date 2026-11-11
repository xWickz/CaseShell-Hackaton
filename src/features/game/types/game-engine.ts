export type TerminalLineType =
  | "system"
  | "input"
  | "success"
  | "error"
  | "hint";

export type TerminalLine = {
  id: string;
  type: TerminalLineType;
  text: string;
};

// Llaves libres: cada caso define las suyas en sus datos.
// La coherencia (que existan, que se puedan alcanzar) la validan las pruebas
// en engine/__tests__/cases.test.ts.
export type CaseKnowledge = Record<string, boolean | undefined>;

export type CaseProgress = Record<string, boolean | undefined> & {
  completed?: boolean;
};

export type CaseState = {
  knowledge: CaseKnowledge;
  progress: CaseProgress;
};

export type FailurePayload = {
  reason: string;
  lockout?: boolean;
  strike?: boolean;
  effect?: AlertEffectId;
};

export type CommandExecutionResult = {
  lines: TerminalLine[];
  nextState?: DeepPartial<CaseState>;
  completed?: boolean;
  completedObjectiveKey?: keyof CaseProgress;
  failure?: FailurePayload;
};

// --- Definición de caso como datos (ver data/cases/) ---

/** Texto plano = línea "system". */
export type CaseLine = string | { text: string; type: TerminalLineType };

/** Archivo legible con `cat <name>`. Leerlo puede enseñar un comando. */
export type CaseFile = {
  name: string;
  lines: CaseLine[];
  teaches?: keyof CaseKnowledge;
};

/** Objetivos que deben estar completos antes de una acción. */
export type CaseGate = {
  progress: (keyof CaseProgress)[];
  lines: CaseLine[];
  /** Si existe, intentarlo antes de tiempo cuenta como fallo. */
  failure?: FailurePayload;
};

/** Comando que resuelve un objetivo del caso. */
export type CaseAction = {
  command: string;
  /** Nombre corto para `status`. */
  label: string;
  /** Conocimiento necesario para ejecutarlo (se obtiene leyendo archivos). */
  knowledge: keyof CaseKnowledge;
  /** Respuesta si aún no tiene el conocimiento. Hay un texto por defecto. */
  unknown?: CaseLine[];
  /** Se revisan en orden; el primero sin cumplir responde. */
  after?: CaseGate[];
  objective: keyof CaseProgress;
  /** El comando recibe un argumento: `<command> <value>`. */
  code?: {
    value: string;
    missing: CaseLine[];
    wrong: CaseLine[];
    failure: FailurePayload;
  };
  lines: CaseLine[];
  alreadyDone: string;
};

export type CaseDefinition = {
  id: string;
  helpNote: string;
  /** `help` lista los `cat <archivo>` (pista extra para casos fáciles). */
  helpListsFiles?: boolean;
  files: CaseFile[];
  actions: CaseAction[];
  destructive: { lines: CaseLine[]; failure: FailurePayload };
  submit: { pending: CaseLine[]; done: CaseLine[] };
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type AlertEffectId =
  | "filesystem-lock"
  | "screen-obscure"
  | "scramble-labels";

export type AlertEffectState = {
  filesystemLocked: boolean;
  screenObscured: boolean;
  labelsScrambled: boolean;
};

export type ActiveTerminalAlert = {
  id: string;
  resolveCommand: string;
  reminder: string;
  resolveLines: string[];
  effect?: AlertEffectId;
};

type FailureType = "timeout" | "command";

export type FailureState = {
  strikes: number;
  maxStrikes: number;
  reason: string | null;
  isLockedOut: boolean;
  failureType: FailureType | null;
};
