import { describe, expect, it } from "vitest";
import type { GameCase } from "@/features/game/data/cases";
import { getGameCase, pickVars } from "@/features/game/data/cases";
import {
  executeCaseCommand,
  getTerminalCommands,
} from "@/features/game/engine/case-engine";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

describe("executeCaseCommand", () => {
  it("routes each case id to its own engine", () => {
    for (const [id, code] of [
      ["easy", "EASY-001"],
      ["medium", "MED-002"],
      ["hard", "HARD-003"],
    ]) {
      const result = executeCaseCommand(id, "status", baseState);
      expect(result.lines[0]?.text).toContain(code);
    }
  });

  it("falls back to easy for unknown ids (old persisted sessions)", () => {
    const result = executeCaseCommand("nope", "status", baseState);
    expect(result.lines[0]?.text).toContain("EASY-001");
  });
});

describe("semilla de partida", () => {
  it("el override correcto depende de la semilla", () => {
    const medium = getGameCase("medium") as GameCase;
    const seed = Array.from({ length: 50 }, (_, i) => i + 1).find(
      (s) => pickVars(medium, s).override !== "884",
    ) as number;
    const code = pickVars(medium, seed).override;
    const state: CaseState = {
      knowledge: { knowsDnsOverride: true },
      progress: { dnsDiagnosticsComplete: true },
    };

    expect(
      executeCaseCommand("medium", `enter override ${code}`, state, seed)
        .completedObjectiveKey,
    ).toBe("overrideValidated");
    expect(
      executeCaseCommand("medium", "enter override 884", state, seed).failure
        ?.strike,
    ).toBe(true);
  });
});

describe("getTerminalCommands", () => {
  it("includes common and case-specific commands", () => {
    expect(getTerminalCommands("easy")).toContain("help");
    expect(getTerminalCommands("easy")).toContain("fix wifi");
    expect(getTerminalCommands("medium")).toContain("diag dns");
    expect(getTerminalCommands("hard")).toContain("deploy watchdog");
  });

  it("does not leak codes in autocomplete", () => {
    expect(getTerminalCommands("medium")).toContain("enter override");
    expect(getTerminalCommands("medium")).not.toContain("enter override 884");
  });
});
