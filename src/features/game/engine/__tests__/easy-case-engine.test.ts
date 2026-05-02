import { describe, expect, it } from "vitest";
import { executeEasyCommand } from "@/features/game/engine/easy-case-engine";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

describe("executeEasyCommand", () => {
  it("blocks destructive commands", () => {
    const result = executeEasyCommand("rm -rf /", baseState);

    expect(result.failure?.strike).toBe(true);
    expect(result.lines.length).toBeGreaterThan(0);
  });

  it("requires knowledge before fix wifi", () => {
    const result = executeEasyCommand("fix wifi", baseState);

    expect(result.nextState).toBeUndefined();
    expect(result.lines[0]?.type).toBe("error");
  });

  it("completes when submitting after all objectives", () => {
    const state: CaseState = {
      knowledge: {
        knowsWifiFix: true,
        knowsFirewallFix: true,
        knowsMalwareFix: true,
      },
      progress: {
        wifiFixed: true,
        firewallFixed: true,
        malwareKilled: true,
      },
    };

    const result = executeEasyCommand("submit", state);

    expect(result.completed).toBe(true);
  });
});
