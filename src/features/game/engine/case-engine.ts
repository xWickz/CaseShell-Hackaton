import {
  getGameCaseOrDefault,
  getSessionCase,
} from "@/features/game/data/cases";
import type {
  CaseState,
  CommandExecutionResult,
} from "@/features/game/types/game-engine";
import {
  COMMON_COMMANDS,
  getCaseCommands,
  runCaseCommand,
} from "./case-runner";

export function executeCaseCommand(
  caseId: string,
  rawInput: string,
  state: CaseState,
  seed = 0,
): CommandExecutionResult {
  return runCaseCommand(getSessionCase(caseId, seed).engine, rawInput, state);
}

/** Comandos para autocompletar en la terminal. */
export function getTerminalCommands(caseId: string): string[] {
  return [
    ...COMMON_COMMANDS,
    ...getCaseCommands(getGameCaseOrDefault(caseId).engine),
  ];
}
