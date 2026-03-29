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
  knowsDnsDiagnostics?: boolean;
  knowsServicesVerification?: boolean;
  knowsIncidentReport?: boolean;
  knowsSwitchAudit?: boolean;
  knowsPerimeterScan?: boolean;
  knowsDnsOverride?: boolean;
  knowsWatchdog?: boolean;
};

export type CaseProgress = {
  wifiFixed?: boolean;
  firewallFixed?: boolean;
  malwareKilled?: boolean;
  dnsFixed?: boolean;
  servicesRestarted?: boolean;
  switchPortEnabled?: boolean;
  dnsDiagnosticsComplete?: boolean;
  overrideValidated?: boolean;
  servicesVerified?: boolean;
  incidentReportFiled?: boolean;
  switchAuditComplete?: boolean;
  perimeterScanComplete?: boolean;
  watchdogDeployed?: boolean;
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
  completedObjectiveKey?: keyof CaseProgress;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type AlertEffectId =
  | "filesystem-lock"
  | "screen-obscure"
  | "scramble-labels";

export type AlertEffectState = {
  filesystemLocked: boolean;
  screenObscured: boolean;
  labelsScrambled: boolean;
};

export type ActiveTerminalAlert = {
  id: string;
  resolveCommand: string;
  reminder: string;
  resolveLines: string[];
  effect?: AlertEffectId;
};
