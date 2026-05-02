import { describe, expect, it } from "vitest";
import { executeCaseCommand } from "@/features/game/engine/case-engine";
import type { CaseState } from "@/features/game/types/game-engine";

const baseState: CaseState = {
  knowledge: {},
  progress: {},
};

describe("executeCaseCommand", () => {
  it("routes to the easy engine by default", () => {
    const result = executeCaseCommand("easy", "help", baseState);

    expect(result.lines.length).toBeGreaterThan(0);
  });

  it("routes to the medium engine", () => {
    const result = executeCaseCommand("medium", "help", baseState);

    expect(result.lines.length).toBeGreaterThan(0);
  });

  it("routes to the hard engine", () => {
    const result = executeCaseCommand("hard", "help", baseState);

    expect(result.lines.length).toBeGreaterThan(0);
  });
});
