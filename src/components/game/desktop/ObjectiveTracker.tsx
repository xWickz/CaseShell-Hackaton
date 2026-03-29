"use client";

import { useEffect, useMemo, useId, type CSSProperties } from "react";
import { CheckCircle2, CircleDot, Circle, ChevronDown, X } from "lucide-react";
import type { Difficulty } from "@/types/game";
import type { CaseProgress } from "@/types/game-engine";
import { useGameSessionStore } from "@/store/useGameSessionStore";

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
        <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
      );
    case "ready":
      return <CircleDot className="h-4 w-4 text-cyan-400" aria-hidden="true" />;
    default:
      return <Circle className="h-4 w-4 text-white/30" aria-hidden="true" />;
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

  const confettiKey = lastCompletedKey
    ? `${String(lastCompletedKey)}-${completionStreak}`
    : "idle";

  return (
    <aside
      className={`pointer-events-auto relative flex w-80 flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-xs text-white shadow-2xl transition-[height] ${className}`}
    >
      {lastCompletedKey && !collapsed ? (
        <div
          key={confettiKey}
          className="pointer-events-none absolute inset-x-6 top-16 z-20 h-14 overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              key={`${confettiKey}-${index}`}
              className="absolute top-1/2 h-2 w-2 rounded-full bg-emerald-300/80 animate-objective-confetti"
              style={
                {
                  left: `${8 + index * 6.5}%`,
                  animationDelay: `${index * 40}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-white/40">
            Objetivos del caso
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {completion.percent}%
            </span>
            <span className="text-white/60">
              {completion.done}/{completion.total} tareas
            </span>
          </div>

          {completionStreak > 0 && !collapsed ? (
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-emerald-300/80">
              Racha: {completionStreak}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-white/70">
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
            className="rounded-lg border border-white/15 bg-white/5 p-1 hover:bg-white/10"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                collapsed ? "-rotate-90" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de objetivos"
            className="rounded-lg border border-white/15 bg-white/5 p-1 hover:bg-red-500/10 hover:text-red-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {collapsed ? (
        <p className="text-[0.7rem] text-white/60" id={contentId}>
          Panel minimizado. Usa la flecha o el acceso en la barra para volver a
          abrir la lista.
        </p>
      ) : (
        <div className="space-y-4" id={contentId}>
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-white/60">
                {section.title}
              </p>

              <ul className="space-y-2">
                {section.steps.map((step) => {
                  const status = resolveStatus(step, progress);
                  const isFreshlyCompleted = lastCompletedKey === step.key;

                  return (
                    <li
                      key={step.key}
                      className={`relative flex items-center gap-2 rounded-xl px-3 py-2 transition-all ${
                        isFreshlyCompleted
                          ? "scale-[1.02] border border-emerald-400/40 bg-emerald-400/15 shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_0_32px_rgba(16,185,129,0.18)] animate-objective-pulse"
                          : "bg-black/20"
                      }`}
                    >
                      {statusIcon(status)}

                      <div>
                        <p className="text-sm text-white">{step.label}</p>
                        {step.hint ? (
                          <p className="text-[0.65rem] text-white/50">
                            {step.hint}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}
