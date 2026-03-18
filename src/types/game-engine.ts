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

export type CaseKnowledge = {
  knowsWifiFix?: boolean;
  knowsFirewallFix?: boolean;
  knowsMalwareFix?: boolean;
  knowsDnsFix?: boolean;
  knowsServiceRestart?: boolean;
  knowsSwitchFix?: boolean;
};

export type CaseProgress = {
  wifiFixed?: boolean;
  firewallFixed?: boolean;
  malwareKilled?: boolean;
  dnsFixed?: boolean;
  servicesRestarted?: boolean;
  switchPortEnabled?: boolean;
  completed?: boolean;
};

export type CaseState = {
  knowledge: CaseKnowledge;
  progress: CaseProgress;
};

export type CommandExecutionResult = {
  lines: TerminalLine[];
  nextState?: DeepPartial<CaseState>;
  completed?: boolean;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
