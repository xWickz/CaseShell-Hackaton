import type { Difficulty } from "@/types/game";
import type { CaseProgress } from "@/types/game-engine";

export type ChecklistItem = {
  key: keyof CaseProgress;
  label: string;
  difficulties: Difficulty[];
};

export const CHECKLIST_CONFIG: ChecklistItem[] = [
  { key: "wifiFixed", label: "WiFi restaurado", difficulties: ["easy", "medium", "hard"] },
  { key: "firewallFixed", label: "Firewall corregido", difficulties: ["easy", "medium", "hard"] },
  { key: "malwareKilled", label: "Malware eliminado", difficulties: ["easy", "medium", "hard"] },
  { key: "dnsFixed", label: "DNS normalizado", difficulties: ["medium", "hard"] },
  { key: "dnsDiagnosticsComplete", label: "Diagnóstico DNS", difficulties: ["medium", "hard"] },
  { key: "overrideValidated", label: "Override aplicado", difficulties: ["medium", "hard"] },
  { key: "servicesRestarted", label: "Servicios reiniciados", difficulties: ["medium", "hard"] },
  { key: "servicesVerified", label: "Servicios verificados", difficulties: ["medium", "hard"] },
  { key: "incidentReportFiled", label: "Informe final enviado", difficulties: ["medium", "hard"] },
  { key: "switchPortEnabled", label: "Puerto crítico habilitado", difficulties: ["hard"] },
  { key: "perimeterScanComplete", label: "Escaneo perimetral", difficulties: ["hard"] },
  { key: "watchdogDeployed", label: "Watchdog desplegado", difficulties: ["hard"] },
];

export function getChecklistForDifficulty(difficulty: Difficulty) {
  return CHECKLIST_CONFIG.filter((item) =>
    item.difficulties.includes(difficulty),
  );
}

export function getChecklistProgress(
  difficulty: Difficulty,
  progress: CaseProgress,
) {
  const items = getChecklistForDifficulty(difficulty);
  const completed = items.filter((item) => progress[item.key]).length;
  return {
    completed,
    total: items.length,
    remaining: Math.max(items.length - completed, 0),
  };
}
