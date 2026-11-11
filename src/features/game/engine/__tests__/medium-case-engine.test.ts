import { describe, expect, it } from "vitest";
import { medium002 } from "@/features/game/data/cases/medium-002";
import { runCaseCommand } from "@/features/game/engine/case-runner";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

const executeMediumCommand = (input: string, state: CaseState) =>
  runCaseCommand(medium002, input, state);

describe("executeMediumCommand", () => {
  it("fails on wrong override code", () => {
    const state: CaseState = {
      ...baseState,
      knowledge: {
        knowsDnsOverride: true,
      },
      progress: {
        dnsDiagnosticsComplete: true,
      },
    };

    const result = executeMediumCommand("enter override 999", state);

    expect(result.failure?.strike).toBe(true);
    expect(result.failure?.effect).toBe("scramble-labels");
  });

  it("fails when restarting services without verification", () => {
    const state: CaseState = {
      ...baseState,
      knowledge: {
        knowsServiceRestart: true,
      },
      progress: {
        servicesVerified: false,
      },
    };

    const result = executeMediumCommand("restart services", state);

    expect(result.failure?.strike).toBe(true);
    expect(result.failure?.effect).toBe("screen-obscure");
  });
});
