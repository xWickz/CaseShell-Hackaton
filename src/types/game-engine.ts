export type TerminalLineType =
  | "system"
  | "input"
  | "success"
  | "error"
  | "hint";

export type TerminalLine = {
  id: string;
  type: TerminalLineType;
  text: string;
};

export type EasyCaseKnowledge = {
  knowsWifiFix?: boolean;
  knowsFirewallFix?: boolean;
  knowsMalwareFix?: boolean;
};

export type EasyCaseProgress = {
  wifiFixed?: boolean;
  firewallFixed?: boolean;
  malwareKilled?: boolean;
  completed?: boolean;
};

export type EasyCaseState = {
  knowledge: EasyCaseKnowledge;
  progress: EasyCaseProgress;
};

export type CommandExecutionResult = {
  lines: TerminalLine[];
  nextState?: DeepPartial<EasyCaseState>;
  completed?: boolean;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
