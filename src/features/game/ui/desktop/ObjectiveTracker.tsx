"use client";

import { CheckCircle2, Circle, CircleDot, Minus, Plus, X } from "lucide-react";
import { useEffect, useId, useMemo } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import type { Difficulty } from "@/features/game/types/game";
import type { CaseProgress } from "@/features/game/types/game-engine";

type StepStatus = "done" | "ready" | "locked";

type StepDefinition = {
  key: keyof CaseProgress;
  label: string;
  dependsOn?: Array<keyof CaseProgress>;
  hint?: string;
};

type StepSection = {
  title: string;
  steps: StepDefinition[];
};

const trackerConfig: Record<Difficulty, StepSection[]> = {
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
          label: "Override 884",
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

function resolveStatus(
  step: StepDefinition,
  progress: CaseProgress,
): StepStatus {
  if (progress[step.key]) return "done";
  const dependencies = step.dependsOn ?? [];
  const depsReady = dependencies.every((dep) => Boolean(progress[dep]));
  return depsReady ? "ready" : "locked";
}

function statusIcon(status: StepStatus) {
  switch (status) {
    case "done":
      return (
        <CheckCircle2 className="size-4 text-[#2e9b2e]" aria-hidden="true" />
      );
    case "ready":
      return <CircleDot className="size-4 text-[#0a4fd6]" aria-hidden="true" />;
    default:
      return <Circle className="size-4 text-[#a0a0a0]" aria-hidden="true" />;
  }
}

type ObjectiveTrackerProps = {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
};

export default function ObjectiveTracker({
  className = "",
  collapsed = false,
  onToggleCollapse,
  onClose,
}: ObjectiveTrackerProps) {
  const difficulty = useGameSessionStore((state) => state.currentDifficulty);
  const progress = useGameSessionStore((state) => state.caseState.progress);
  const lastCompletedKey = useGameSessionStore(
    (state) => state.lastCompletedKey,
  );
  const completionStreak = useGameSessionStore(
    (state) => state.completionStreak,
  );
  const clearLastCompletedKey = useGameSessionStore(
    (state) => state.clearLastCompletedKey,
  );

  const contentId = useId();

  const { sections, completion } = useMemo(() => {
    const sections = trackerConfig[difficulty];
    const steps = sections.flatMap((section) => section.steps);
    const completed = steps.filter((step) => progress[step.key]).length;
    const percent = Math.round((completed / steps.length) * 100);

    return {
      sections,
      completion: {
        total: steps.length,
        done: completed,
        percent,
      },
    };
  }, [difficulty, progress]);

  useEffect(() => {
    if (!lastCompletedKey) return;

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(35);
    }

    const timeoutId = window.setTimeout(() => {
      clearLastCompletedKey();
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [lastCompletedKey, clearLastCompletedKey]);

  return (
    <aside
      className={`os-window pointer-events-auto flex w-72 flex-col text-[11px] text-black ${className}`}
    >
      <header className="os-titlebar flex items-center justify-between text-white">
        <span>Objetivos del caso</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={
              collapsed
                ? "Expandir panel de objetivos"
                : "Minimizar panel de objetivos"
            }
            aria-expanded={!collapsed}
            aria-controls={contentId}
            className="os-titlebtn"
          >
            {collapsed ? (
              <Plus className="size-3.5" aria-hidden="true" />
            ) : (
              <Minus className="size-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de objetivos"
            className="os-titlebtn os-close"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="space-y-2 p-2" id={contentId}>
        <div className="flex items-center gap-2">
          <div
            className="xp-progress flex-1"
            role="progressbar"
            aria-valuenow={completion.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso del caso"
          >
            <span style={{ width: `${completion.percent}%` }} />
          </div>
          <span>
            {completion.done}/{completion.total}
          </span>
        </div>

        {completionStreak > 0 && !collapsed ? (
          <p className="text-[#2e9b2e]">Racha: {completionStreak}</p>
        ) : null}

        {collapsed
          ? null
          : sections.map((section) => (
              <fieldset
                key={section.title}
                className="rounded-[3px] border border-[#d0d0bf] px-2 pb-2"
              >
                <legend className="px-1 text-[#0046d5]">{section.title}</legend>

                <ul className="space-y-0.5">
                  {section.steps.map((step) => {
                    const status = resolveStatus(step, progress);
                    const isFreshlyCompleted = lastCompletedKey === step.key;

                    return (
                      <li
                        key={step.key}
                        className={`flex items-center gap-2 px-1 py-0.5 ${
                          isFreshlyCompleted
                            ? "animate-objective-pulse bg-[#316ac5] text-white"
                            : status === "locked"
                              ? "text-[#808080]"
                              : ""
                        }`}
                      >
                        {statusIcon(status)}
                        <span>{step.label}</span>
                        {step.hint ? (
                          <span className="text-[#808080]">{step.hint}</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}
      </div>
    </aside>
  );
}
