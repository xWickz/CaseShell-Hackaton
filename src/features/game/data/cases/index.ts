import type { ChatScriptEntry } from "@/features/game/data/chat-script";
import { chatScripts } from "@/features/game/data/chat-script";
import type { DesktopHint } from "@/features/game/data/desktop-hints";
import { hintsForDifficulty } from "@/features/game/data/desktop-hints";
import { difficulties } from "@/features/game/data/mock/difficulties";
import { briefingsByDifficulty } from "@/features/game/data/mock/mock-briefings";
import { mockDesktopItemsByDifficulty } from "@/features/game/data/mock/mock-filesystem";
import type { StepSection } from "@/features/game/data/objective-tracker";
import { trackerConfig } from "@/features/game/data/objective-tracker";
import type {
  Briefing,
  DesktopItem,
  Difficulty,
} from "@/features/game/types/game";
import type { CaseDefinition } from "@/features/game/types/game-engine";
import { christmas001 } from "./christmas-001";
import { easy001 } from "./easy-001";
import { halloween001 } from "./halloween-001";
import { hard003 } from "./hard-003";
import { medium002 } from "./medium-002";

export type Season = "halloween" | "christmas";

/** Todo lo que define un caso jugable. */
export type GameCase = {
  /** Ruta (/game/<id>) y llave del ranking. */
  id: string;
  tier: Difficulty;
  /** Código que muestra la terminal al iniciar. */
  code: string;
  card: {
    label: string;
    description: string;
    threat: string;
    meta: { duration: string; files: string; focus: string };
  };
  briefing: Briefing;
  timeLimitMs: number;
  maxStrikes: number;
  engine: CaseDefinition;
  desktop: DesktopItem[];
  chat: ChatScriptEntry[];
  tracker: StepSection[];
  desktopHints: DesktopHint[];
  /** Caso que ofrece el modal de victoria. */
  next?: string;
  /** Solo se lista dentro de la ventana anual (MM-DD, inclusive). */
  season?: { theme: Season; from: string; to: string };
  /**
   * Valores que cambian en cada partida. Cualquier texto del caso puede usar
   * `{{nombre}}` y se reemplaza al iniciar (ver instantiateCase).
   * El primer valor es el clásico (y el de partidas guardadas sin semilla).
   */
  vars?: Record<string, string[]>;
};

// Para casos con imagen: el código del override también está dibujado en
// public/game/dns-lock-<código>.webp, así que solo valen códigos con imagen.
const OVERRIDE_CODES = ["884", "317", "592", "746", "205", "639", "471"];

const card = (id: Difficulty) => {
  const option = difficulties.find((d) => d.id === id);
  if (!option) throw new Error(`Falta la tarjeta de ${id} en difficulties.ts`);
  const { label, description, threat, meta } = option;
  return { label, description, threat, meta };
};

// Los 3 casos originales comparten estructura; sus datos siguen en sus
// archivos de siempre. Los casos nuevos traen todo en su propio archivo.
const original = (
  id: Difficulty,
  engine: CaseDefinition,
  extra: Pick<
    GameCase,
    "code" | "timeLimitMs" | "maxStrikes" | "next" | "vars"
  >,
): GameCase => ({
  id,
  tier: id,
  card: card(id),
  briefing: briefingsByDifficulty[id],
  engine,
  desktop: mockDesktopItemsByDifficulty[id],
  chat: chatScripts[id],
  tracker: trackerConfig[id],
  desktopHints: hintsForDifficulty(id),
  ...extra,
});

export const GAME_CASES: GameCase[] = [
  original("easy", easy001, {
    code: "EASY-001-ACCESS-NOT-GRANTED",
    timeLimitMs: 20 * 60 * 1000,
    maxStrikes: 3,
    next: "medium",
  }),
  original("medium", medium002, {
    code: "MED-002-DATA-LEAK",
    timeLimitMs: 15 * 60 * 1000,
    maxStrikes: 3,
    next: "hard",
    vars: { override: OVERRIDE_CODES },
  }),
  original("hard", hard003, {
    code: "HARD-003-CRITICAL-COLLAPSE",
    timeLimitMs: 10 * 60 * 1000,
    maxStrikes: 2,
    vars: { override: OVERRIDE_CODES },
  }),
  halloween001,
  christmas001,
];

export const DEFAULT_CASE_ID = "easy";

export const TIER_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

export function getGameCase(id: string): GameCase | undefined {
  return GAME_CASES.find((c) => c.id === id);
}

/** Igual que getGameCase pero cae al caso por defecto (datos persistidos viejos). */
export function getGameCaseOrDefault(id: string): GameCase {
  return getGameCase(id) ?? (getGameCase(DEFAULT_CASE_ID) as GameCase);
}

export function isInSeason(gameCase: GameCase, date = new Date()): boolean {
  if (!gameCase.season) return true;
  const md = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
  const { from, to } = gameCase.season;
  // Ventanas que cruzan año nuevo (12-01 → 01-06).
  return from <= to ? md >= from && md <= to : md >= from || md <= to;
}

/** Semilla para una partida nueva (0 queda reservado para "valores clásicos"). */
export function newCaseSeed(): number {
  return 1 + Math.floor(Math.random() * 2_000_000_000);
}

/** Valor elegido para cada var según la semilla. Semilla 0 → primer valor. */
export function pickVars(gameCase: GameCase, seed: number) {
  return Object.fromEntries(
    Object.entries(gameCase.vars ?? {}).map(([name, options]) => {
      if (!seed) return [name, options[0]];
      // FNV-1a de "seed:name": cada var cambia de forma independiente.
      let h = 2166136261;
      for (const ch of `${seed}:${name}`) {
        h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
      }
      return [name, options[(h >>> 0) % options.length]];
    }),
  );
}

const instances = new Map<string, GameCase>();

/** El caso con sus `{{vars}}` resueltas para esta partida. */
export function instantiateCase(gameCase: GameCase, seed: number): GameCase {
  if (!gameCase.vars) return gameCase;
  const key = `${gameCase.id}:${seed}`;
  let instance = instances.get(key);
  if (!instance) {
    const values = pickVars(gameCase, seed);
    instance = JSON.parse(
      JSON.stringify(gameCase).replace(
        /\{\{(\w+)\}\}/g,
        (match, name: string) => values[name] ?? match,
      ),
    ) as GameCase;
    instances.set(key, instance);
  }
  return instance;
}

/** Caso de la partida en curso (id + semilla del store). */
export function getSessionCase(caseId: string, seed: number): GameCase {
  return instantiateCase(getGameCaseOrDefault(caseId), seed);
}

/** En desarrollo todos los casos de temporada están abiertos para probarlos. */
export function isPlayable(gameCase: GameCase, date = new Date()): boolean {
  return process.env.NODE_ENV !== "production" || isInSeason(gameCase, date);
}
