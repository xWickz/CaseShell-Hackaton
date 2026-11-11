import type { Difficulty } from "@/features/game/types/game";
import type { CaseProgress } from "@/features/game/types/game-engine";

type StepDefinition = {
  key: keyof CaseProgress;
  label: string;
  dependsOn?: Array<keyof CaseProgress>;
  hint?: string;
};

export type StepSection = {
  title: string;
  steps: StepDefinition[];
};

export const trackerConfig: Record<Difficulty, StepSection[]> = {
  easy: [
    {
      title: "Infra básica",
      steps: [
        { key: "wifiFixed", label: "WiFi estabilizado" },
        {
          key: "firewallFixed",
          label: "Firewall saneado",
          dependsOn: ["wifiFixed"],
        },
        {
          key: "malwareKilled",
          label: "Proceso malicioso detenido",
          dependsOn: ["firewallFixed"],
        },
      ],
    },
  ],
  medium: [
    {
      title: "Red y seguridad",
      steps: [
        { key: "wifiFixed", label: "WiFi" },
        { key: "firewallFixed", label: "Firewall" },
        { key: "malwareKilled", label: "Malware" },
      ],
    },
    {
      title: "Cadena DNS",
      steps: [
        {
          key: "dnsDiagnosticsComplete",
          label: "Diag DNS",
          dependsOn: ["malwareKilled"],
        },
        {
          key: "overrideValidated",
          label: "Override {{override}}",
          dependsOn: ["dnsDiagnosticsComplete"],
        },
        {
          key: "dnsFixed",
          label: "Fix DNS",
          dependsOn: ["overrideValidated"],
        },
      ],
    },
    {
      title: "Servicios & reporte",
      steps: [
        {
          key: "servicesVerified",
          label: "Verify services",
          dependsOn: ["dnsFixed"],
        },
        {
          key: "servicesRestarted",
          label: "Restart services",
          dependsOn: ["servicesVerified"],
        },
        {
          key: "incidentReportFiled",
          label: "Informe final",
          dependsOn: ["servicesRestarted"],
        },
      ],
    },
  ],
  hard: [
    {
      title: "Contención base",
      steps: [
        { key: "wifiFixed", label: "WiFi" },
        { key: "firewallFixed", label: "Firewall" },
        { key: "malwareKilled", label: "Malware" },
      ],
    },
    {
      title: "DNS / Servicios",
      steps: [
        { key: "dnsDiagnosticsComplete", label: "Diag DNS" },
        { key: "overrideValidated", label: "Override" },
        { key: "dnsFixed", label: "Fix DNS" },
        { key: "servicesVerified", label: "Verify" },
        { key: "servicesRestarted", label: "Restart" },
      ],
    },
    {
      title: "Perímetro",
      steps: [
        {
          key: "perimeterScanComplete",
          label: "Scan perimeter",
          dependsOn: ["malwareKilled"],
        },
        {
          key: "watchdogDeployed",
          label: "Deploy watchdog",
          dependsOn: ["perimeterScanComplete"],
        },
      ],
    },
    {
      title: "Switch & entrega",
      steps: [
        {
          key: "switchAuditComplete",
          label: "Audit switch",
          dependsOn: ["servicesRestarted"],
        },
        {
          key: "switchPortEnabled",
          label: "Enable port",
          dependsOn: ["switchAuditComplete"],
        },
        {
          key: "incidentReportFiled",
          label: "Informe final",
          dependsOn: ["watchdogDeployed", "switchPortEnabled"],
        },
      ],
    },
  ],
};
