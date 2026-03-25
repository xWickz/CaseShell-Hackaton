import type { TerminalLine, AlertEffectId } from "@/types/game-engine";
import { ActiveTerminalAlert } from "@/types/game-engine";

type RandomAlertDefinition = {
  id: string;
  introLines: string[];
  reminder: string;
  resolveLines: string[];
  resolveCommand: string;
  effect?: AlertEffectId;
};

const ALERT_DEFINITIONS: RandomAlertDefinition[] = [
  {
    id: "malware-surge",
    introLines: [
      "[ALERTA] El antivirus detectó un binario desconocido en el host.",
      "Ejecuta 'contain-malware' para aislar el proceso antes de perder acceso al shell.",
    ],
    reminder:
      "El antivirus sigue en alerta. Usa contain-malware para aislar la amenaza.",
    resolveLines: [
      "[OK] Binario malicioso contenido. Estabilidad del shell restaurada.",
      "Continúa con el caso; los sensores vuelven a valores normales.",
    ],
    resolveCommand: "contain-malware",
  },
  {
    id: "firewall-chaos",
    introLines: [
      "[ALERTA] El firewall automatizado está bloqueando comandos salientes.",
      "Ejecuta 'stabilize-firewall' para recalibrarlo o el shell quedará bloqueado.",
    ],
    reminder:
      "Firewall inestable. Ejecuta stabilize-firewall para recuperar la sesión.",
    resolveLines: [
      "[OK] Firewall estabilizado. Se reanudan las conexiones intermedias.",
      "Latencia normalizada. Puedes seguir trabajando.",
    ],
    resolveCommand: "stabilize-firewall",
  },
  {
    id: "rogue-scan",
    introLines: [
      "[ALERTA] Un escaneo forense detectó tráfico anómalo en la subred.",
      "Ejecuta 'purge-link' para cerrar el canal clandestino antes de que escale.",
    ],
    reminder:
      "Tráfico anómalo activo. Ejecuta purge-link para contención inmediata.",
    resolveLines: [
      "[OK] Canal clandestino cerrado. La telemetría vuelve a valores seguros.",
    ],
    resolveCommand: "purge-link",
  },
  {
    id: "filesystem-freeze",
    effect: "filesystem-lock",
    introLines: [
      "[ALERTA] El subsistema de archivos detectó sabotaje en la tabla de inodos.",
      "Archivos sellados temporalmente. Ejecuta 'unlock-fs' para recuperar acceso.",
    ],
    reminder:
      "Sistema de archivos sellado. Usa unlock-fs para reabrir los expedientes.",
    resolveLines: [
      "[OK] Bloqueo de archivos levantado. Los documentos vuelven a estar disponibles.",
    ],
    resolveCommand: "unlock-fs",
  },
  {
    id: "grid-blackout",
    effect: "screen-obscure",
    introLines: [
      "[ALERTA] El módulo de video detectó una sobrecarga de fotones.",
      "Visibilidad degradada. Ejecuta 'restore-vision' antes de operar a ciegas.",
    ],
    reminder:
      "Pantalla cegada. Corre restore-vision para disipar la interferencia.",
    resolveLines: [
      "[OK] Flujo óptico normalizado. El HUD vuelve a la claridad habitual.",
    ],
    resolveCommand: "restore-vision",
  },
  {
    id: "asset-scramble",
    effect: "scramble-labels",
    introLines: [
      "[ALERTA] El indexador de escritorio reescribió los metadatos de los archivos.",
      "Identificadores alterados. Ejecuta 'stabilize-index' para ordenar el caos.",
    ],
    reminder:
      "Índices corruptos. Usa stabilize-index para restaurar los nombres originales.",
    resolveLines: [
      "[OK] Índice estabilizado. Los archivos recuperan sus nombres originales.",
    ],
    resolveCommand: "stabilize-index",
  },
];

export function getRandomAlert(): RandomAlertDefinition {
  return ALERT_DEFINITIONS[
    Math.floor(Math.random() * ALERT_DEFINITIONS.length)
  ];
}

export function toActiveAlert(
  definition: RandomAlertDefinition,
): ActiveTerminalAlert {
  return {
    id: definition.id,
    reminder: definition.reminder,
    resolveCommand: definition.resolveCommand,
    resolveLines: definition.resolveLines,
    effect: definition.effect,
  };
}

export function createIntroLines(
  definition: RandomAlertDefinition,
): TerminalLine[] {
  return definition.introLines.map((text) => ({
    id: crypto.randomUUID(),
    type: "error" as const,
    text,
  }));
}

export function createResolveLines(
  lines: string[],
  type: TerminalLine["type"] = "success",
): TerminalLine[] {
  return lines.map((text) => ({
    id: crypto.randomUUID(),
    type,
    text,
  }));
}
