import { describe, expect, it } from "vitest";
import { executeMediumCommand } from "@/features/game/engine/medium-case-engine";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

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
