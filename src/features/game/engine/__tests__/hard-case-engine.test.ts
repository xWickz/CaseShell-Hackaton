import { describe, expect, it } from "vitest";
import { executeHardCommand } from "@/features/game/engine/hard-case-engine";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

describe("executeHardCommand", () => {
  it("fails when enabling port without audit", () => {
    const state: CaseState = {
      ...baseState,
      knowledge: {
        knowsSwitchFix: true,
      },
      progress: {
        switchAuditComplete: false,
      },
    };

    const result = executeHardCommand("enable port", state);

    expect(result.failure?.strike).toBe(true);
    expect(result.failure?.effect).toBe("screen-obscure");
  });

  it("locks out on destructive commands", () => {
    const result = executeHardCommand("rm -rf /", baseState);

    expect(result.failure?.lockout).toBe(true);
    expect(result.failure?.effect).toBe("screen-obscure");
  });
});
