import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { GameCase } from "@/features/game/data/cases";
import {
  GAME_CASES,
  getGameCase,
  instantiateCase,
  isInSeason,
  pickVars,
} from "@/features/game/data/cases";
import { runCaseCommand } from "@/features/game/engine/case-runner";
import type { CaseState } from "@/features/game/types/game-engine";

const SEEDS = [0, 1, 7, 42, 1234, 99999];

// Red para quien escribe casos: los datos de cada caso deben ser coherentes
// y el caso debe poder resolverse, con cualquier semilla.
describe.each(
  GAME_CASES.flatMap((c) =>
    (c.vars ? SEEDS : [0]).map(
      (seed) =>
        [`${c.id} (semilla ${seed})`, instantiateCase(c, seed)] as const,
    ),
  ),
)("caso %s", (_, gameCase) => {
  it("no quedan {{vars}} sin resolver", () => {
    expect(JSON.stringify(gameCase)).not.toMatch(/\{\{\w+\}\}/);
  });

  const def = gameCase.engine;
  const objectives = new Set(def.actions.map((a) => a.objective));
  const taught = new Set(def.files.map((f) => f.teaches));
  const desktopNames = new Set(
    gameCase.desktop.flatMap((i) => [
      i.name,
      ...(i.children ?? []).map((c) => c.name),
    ]),
  );

  it("se resuelve leyendo todo y ejecutando las acciones en orden", () => {
    let state: CaseState = { knowledge: {}, progress: {} };
    const inputs = [
      ...def.files.map((f) => `cat ${f.name}`),
      ...def.actions.map((a) =>
        a.code ? `${a.command} ${a.code.value}` : a.command,
      ),
    ];

    for (const input of inputs) {
      const r = runCaseCommand(def, input, state);
      expect(r.failure, input).toBeUndefined();
      state = {
        knowledge: { ...state.knowledge, ...r.nextState?.knowledge },
        progress: { ...state.progress, ...r.nextState?.progress },
      };
    }

    expect(runCaseCommand(def, "submit", state).completed).toBe(true);
  });

  it("los nombres de archivo de la terminal van en minúsculas", () => {
    for (const f of def.files) expect(f.name).toBe(f.name.toLowerCase());
  });

  it("los códigos van en minúsculas (la entrada se normaliza)", () => {
    for (const a of def.actions) {
      if (a.code) expect(a.code.value).toBe(a.code.value.toLowerCase());
    }
  });

  it("cada acción la enseña algún archivo", () => {
    for (const a of def.actions)
      expect(taught, a.command).toContain(a.knowledge);
  });

  it("tracker, chat y gates usan objetivos que existen", () => {
    const keys = [
      ...gameCase.tracker.flatMap((s) =>
        s.steps.flatMap((st) => [st.key, ...(st.dependsOn ?? [])]),
      ),
      ...gameCase.chat.flatMap((m) =>
        m.condition.type === "progress"
          ? [m.condition.key]
          : m.condition.type === "all"
            ? m.condition.keys
            : [],
      ),
      ...def.actions.flatMap((a) => (a.after ?? []).flatMap((g) => g.progress)),
    ];
    for (const key of keys) expect(objectives, key).toContain(key);
  });

  it("las pistas del escritorio apuntan a archivos y conocimientos reales", () => {
    for (const h of gameCase.desktopHints) {
      expect(desktopNames, h.name).toContain(h.name);
      expect(taught, h.knowledge).toContain(h.knowledge);
    }
  });

  it("el escritorio tiene terminal y chat", () => {
    expect(gameCase.desktop.map((i) => i.type)).toEqual(
      expect.arrayContaining(["terminal", "chat"]),
    );
  });

  it("next apunta a un caso existente", () => {
    if (gameCase.next) expect(getGameCase(gameCase.next)).toBeDefined();
  });
});

describe("temporadas", () => {
  const halloween = getGameCase("halloween") as GameCase;
  const navidad = getGameCase("navidad") as GameCase;
  const d = (s: string) => new Date(`${s}T12:00:00`);

  it("halloween: 15 oct a 1 dic", () => {
    expect(isInSeason(halloween, d("2026-10-14"))).toBe(false);
    expect(isInSeason(halloween, d("2026-10-31"))).toBe(true);
    expect(isInSeason(halloween, d("2026-12-01"))).toBe(true);
    expect(isInSeason(halloween, d("2026-12-02"))).toBe(false);
  });

  it("navidad cruza año nuevo", () => {
    expect(isInSeason(navidad, d("2026-12-24"))).toBe(true);
    expect(isInSeason(navidad, d("2027-01-06"))).toBe(true);
    expect(isInSeason(navidad, d("2027-01-07"))).toBe(false);
    expect(isInSeason(navidad, d("2026-11-30"))).toBe(false);
  });

  it("ids únicos", () => {
    const ids = GAME_CASES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("partidas distintas", () => {
  it("semilla 0 usa los valores clásicos", () => {
    const medium = getGameCase("medium") as GameCase;
    expect(pickVars(medium, 0)).toEqual({ override: "884" });
  });

  it("las semillas reparten valores distintos", () => {
    const medium = getGameCase("medium") as GameCase;
    const seen = new Set(
      Array.from({ length: 200 }, (_, i) => pickVars(medium, i + 1).override),
    );
    expect(seen.size).toBe(medium.vars?.override.length);
  });

  it("cada código de override tiene su imagen del candado", () => {
    for (const code of getGameCase("medium")?.vars?.override ?? []) {
      expect(
        existsSync(join(process.cwd(), `public/game/dns-lock-${code}.webp`)),
        code,
      ).toBe(true);
    }
  });

  it("toda {{var}} usada en un caso está declarada", () => {
    for (const c of GAME_CASES) {
      const used = JSON.stringify(c).match(/\{\{(\w+)\}\}/g) ?? [];
      for (const v of used) {
        expect(Object.keys(c.vars ?? {}), `${c.id}: ${v}`).toContain(
          v.slice(2, -2),
        );
      }
    }
  });
});
