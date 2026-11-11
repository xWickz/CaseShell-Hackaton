import { describe, expect, it } from "vitest";
import { easy001 } from "@/features/game/data/cases/easy-001";
import { runCaseCommand } from "@/features/game/engine/case-runner";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

const executeEasyCommand = (input: string, state: CaseState) =>
  runCaseCommand(easy001, input, state);

describe("easy-001 via case-runner", () => {
  it("reading a file teaches its command", () => {
    const result = executeEasyCommand("cat network.txt", baseState);

    expect(result.nextState).toEqual({ knowledge: { knowsWifiFix: true } });
  });

  it("does not submit with pending objectives", () => {
    const result = executeEasyCommand("submit", {
      knowledge: {},
      progress: { wifiFixed: true, firewallFixed: true },
    });

    expect(result.completed).toBeUndefined();
  });

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
