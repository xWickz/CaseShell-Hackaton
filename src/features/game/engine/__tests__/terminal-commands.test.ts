import { describe, expect, it } from "vitest";
import { getTerminalCommandsForDifficulty } from "@/features/game/engine/terminal-commands";

const COMMON_COMMANDS = ["help", "clear", "ls", "status", "submit"];

describe("getTerminalCommandsForDifficulty", () => {
  it("includes common commands for all difficulties", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const commands = getTerminalCommandsForDifficulty(difficulty);
      for (const common of COMMON_COMMANDS) {
        expect(commands).toContain(common);
      }
    }
  });

  it("includes difficulty-specific commands", () => {
    expect(getTerminalCommandsForDifficulty("easy")).toContain("fix wifi");
    expect(getTerminalCommandsForDifficulty("medium")).toContain("diag dns");
    expect(getTerminalCommandsForDifficulty("hard")).toContain("deploy watchdog");
  });
});
