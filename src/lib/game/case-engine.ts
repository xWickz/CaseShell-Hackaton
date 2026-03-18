import type { CaseState, CommandExecutionResult } from "@/types/game-engine";
import type { Difficulty } from "@/types/game";
import { executeEasyCommand } from "./easy-case-engine";
import { executeMediumCommand } from "./medium-case-engine";
import { executeHardCommand } from "./hard-case-engine";

export function executeCaseCommand(
  difficulty: Difficulty,
  rawInput: string,
  state: CaseState,
): CommandExecutionResult {
  switch (difficulty) {
    case "medium":
      return executeMediumCommand(rawInput, state);
    case "hard":
      return executeHardCommand(rawInput, state);
    case "easy":
    default:
      return executeEasyCommand(rawInput, state);
  }
}
