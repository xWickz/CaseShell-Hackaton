"use client";

import { FileText, Folder, ImageIcon, TerminalSquare } from "lucide-react";
import { useGameUIStore } from "@/store/useGameUIStore";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { DesktopItem } from "@/types/game";

type DesktopIconProps = {
  item: DesktopItem;
  insideWindow?: boolean;
};

export default function DesktopIcon({
  item,
  insideWindow = false,
}: DesktopIconProps) {
  const openWindow = useGameUIStore((state) => state.openWindow);

  const discoverKnowledge = useGameSessionStore(
    (state) => state.discoverKnowledge,
  );
  const addTerminalLines = useGameSessionStore(
    (state) => state.addTerminalLines,
  );
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

  const handleOpen = () => {
    if (item.name === "network.txt") {
      discoverKnowledge("knowsWifiFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Nueva pista descubierta: el reporte de red contiene la solución del Wi-Fi.",
        },
      ]);
    }

    if (item.name === "firewall.txt") {
      discoverKnowledge("knowsFirewallFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Nueva pista descubierta: el análisis del firewall revela una regla bloqueada.",
        },
      ]);
    }

    if (item.name === "suspicious-processes.txt") {
      discoverKnowledge("knowsMalwareFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Nueva pista descubierta: identificaste un proceso sospechoso en ejecución.",
        },
      ]);
    }

    if (item.name === "resolver.conf" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Reporte DNS analizado: puedes normalizar los reenviadores con 'fix dns'.",
        },
      ]);
    }

    if (item.name === "system.log" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsServiceRestart");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Los logs indican que debes ejecutar 'restart services' tras estabilizar la red.",
        },
      ]);
    }

    if (item.name === "switch.conf" && currentDifficulty === "hard") {
      discoverKnowledge("knowsSwitchFix");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Configuración de switch encontrada: habilita el puerto crítico con 'enable port'.",
        },
      ]);
    }

    if (item.name === "ops-note.txt" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsDiagnostics");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Las notas operativas ordenan ejecutar 'diag dns' antes de aplicar cualquier fix.",
        },
      ]);
    }

    if (item.name === "dns-runes.png" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsDiagnostics");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El rompecabezas DNS confirma que la secuencia correcta es DIAG ➜ FIX.",
        },
      ]);
    }

    if (item.name === "dns-lock.png" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsDnsOverride");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El candado DNS revela el override 8-8-4 necesario para desbloquear el fix.",
        },
      ]);
    }

    if (item.name === "service-manual.txt" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsServicesVerification");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El playbook exige correr 'verify services' antes de 'restart services'.",
        },
      ]);
    }

    if (item.name === "incident-template.txt" && currentDifficulty !== "easy") {
      discoverKnowledge("knowsIncidentReport");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Necesitarás completar el informe ejecutando 'file report' tras los arreglos.",
        },
      ]);
    }

    if (item.name === "switch-override.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsSwitchAudit");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "Notas del switch: corre 'audit switch' antes de 'enable port'.",
        },
      ]);
    }

    if (item.name === "tamper-photo.png" && currentDifficulty === "hard") {
      discoverKnowledge("knowsPerimeterScan");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "La foto del sello manipulado sugiere ejecutar 'scan perimeter'.",
        },
      ]);
    }

    if (item.name === "perimeter-note.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsPerimeterScan");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El memo de perímetro exige documentar un 'scan perimeter' antes del cierre.",
        },
      ]);
    }

    if (item.name === "chain-of-custody.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsIncidentReport");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "La cadena de custodia detalla los datos requeridos por 'file report'.",
        },
      ]);
    }

    if (item.name === "watchdog-brief.txt" && currentDifficulty === "hard") {
      discoverKnowledge("knowsWatchdog");
      addTerminalLines([
        {
          id: crypto.randomUUID(),
          type: "hint",
          text: "El briefing del SOC exige desplegar un watchdog tras el escaneo perimetral.",
        },
      ]);
    }

    openWindow({
      id: item.id,
      title: item.name,
      type: item.type,
      content: item.content,
      imageUrl: item.imageUrl,
      children: item.children,
    });
  };

  const iconClass = insideWindow ? "w-8 h-8" : "w-10 h-10";

  const renderIcon = () => {
    switch (item.type) {
      case "text":
        return <FileText className={`${iconClass} text-sky-300`} />;
      case "image":
        return <ImageIcon className={`${iconClass} text-pink-300`} />;
      case "folder":
        return <Folder className={`${iconClass} text-yellow-300`} />;
      case "terminal":
        return <TerminalSquare className={`${iconClass} text-green-300`} />;
      default:
        return <FileText className={`${iconClass} text-white`} />;
    }
  };

  return (
    <button
      onDoubleClick={handleOpen}
      className="flex w-24 flex-col items-center gap-2 rounded-xl p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      aria-label={`Abrir ${item.name}`}
      title={item.name}
    >
      {renderIcon()}
      <span className="max-w-[100px] text-center text-xs font-medium">
        {item.name}
      </span>
    </button>
  );
}
