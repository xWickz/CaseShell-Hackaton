import { describe, expect, it } from "vitest";
import {
  getChecklistForDifficulty,
  getChecklistProgress,
} from "@/features/game/data/checklist";
import type { CaseProgress } from "@/features/game/types/game-engine";

describe("checklist helpers", () => {
  it("returns the expected easy checklist size", () => {
    const items = getChecklistForDifficulty("easy");
    const keys = items.map((item) => item.key);

    expect(items).toHaveLength(3);
    expect(keys).toEqual(["wifiFixed", "firewallFixed", "malwareKilled"]);
  });

  it("computes progress totals for medium", () => {
    const progress: CaseProgress = {
      wifiFixed: true,
      firewallFixed: true,
      dnsFixed: true,
    };

    const totals = getChecklistProgress("medium", progress);

    expect(totals.total).toBe(9);
    expect(totals.completed).toBe(3);
    expect(totals.remaining).toBe(6);
  });
});
