import { describe, expect, it } from "vitest";
import { hard003 } from "@/features/game/data/cases/hard-003";
import { runCaseCommand } from "@/features/game/engine/case-runner";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

const executeHardCommand = (input: string, state: CaseState) =>
  runCaseCommand(hard003, input, state);

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
