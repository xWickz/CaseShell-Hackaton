import type { Difficulty } from "@/types/game";

const COMMON_COMMANDS = ["help", "clear", "ls", "status", "submit"] as const;

const EASY_COMMANDS = [
  "cat caso.txt",
  "cat network.txt",
  "cat firewall.txt",
  "cat suspicious-processes.txt",
  "fix wifi",
  "fix firewall",
  "kill malware",
] as const;

const MEDIUM_COMMANDS = [
  "cat caso.txt",
  "cat network.txt",
  "cat firewall.txt",
  "cat suspicious-processes.txt",
  "cat resolver.conf",
  "cat system.log",
  "cat ops-note.txt",
  "cat dns-runes.png",
  "cat dns-lock.png",
  "cat service-manual.txt",
  "cat incident-template.txt",
  "fix wifi",
  "fix firewall",
  "kill malware",
  "diag dns",
  "enter override 884",
  "fix dns",
  "verify services",
  "restart services",
  "file report",
] as const;

const HARD_COMMANDS = [
  "cat caso.txt",
  "cat network.txt",
  "cat firewall.txt",
  "cat suspicious-processes.txt",
  "cat resolver.conf",
  "cat system.log",
  "cat switch.conf",
  "cat ops-note.txt",
  "cat dns-runes.png",
  "cat dns-lock.png",
  "cat service-manual.txt",
  "cat incident-template.txt",
  "cat perimeter-note.txt",
  "cat switch-override.txt",
  "cat chain-of-custody.txt",
  "cat watchdog-brief.txt",
  "fix wifi",
  "fix firewall",
  "kill malware",
  "diag dns",
  "enter override 884",
  "fix dns",
  "verify services",
  "restart services",
  "scan perimeter",
  "audit switch",
  "deploy watchdog",
  "enable port",
  "file report",
] as const;

export function getTerminalCommandsForDifficulty(
  difficulty: Difficulty,
): string[] {
  switch (difficulty) {
    case "medium":
      return [...COMMON_COMMANDS, ...MEDIUM_COMMANDS];
    case "hard":
      return [...COMMON_COMMANDS, ...HARD_COMMANDS];
    case "easy":
    default:
      return [...COMMON_COMMANDS, ...EASY_COMMANDS];
  }
}
