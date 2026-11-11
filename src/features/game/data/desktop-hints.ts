import type { Difficulty } from "@/features/game/types/game";

/** Abrir `name` en el escritorio enseña `knowledge` y escribe `text` en la terminal. */
export type DesktopHint = {
  name: string;
  knowledge: string;
  text: string;
};

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

type KnowledgeHint = DesktopHint & {
  minDifficulty?: Difficulty;
  exactDifficulty?: Difficulty;
};

/** Pistas de los 3 casos originales, que comparten escritorio base. */
export function hintsForDifficulty(difficulty: Difficulty): DesktopHint[] {
  return KNOWLEDGE_HINTS.filter(
    (hint: KnowledgeHint) =>
      (!hint.exactDifficulty || hint.exactDifficulty === difficulty) &&
      (!hint.minDifficulty ||
        DIFFICULTY_ORDER[difficulty] >= DIFFICULTY_ORDER[hint.minDifficulty]),
  );
}

const KNOWLEDGE_HINTS = [
  {
    name: "network.txt",
    knowledge: "knowsWifiFix",
    text: "Nueva pista descubierta: el reporte de red contiene la solucion del Wi-Fi.",
  },
  {
    name: "firewall.txt",
    knowledge: "knowsFirewallFix",
    text: "Nueva pista descubierta: el analisis del firewall revela una regla bloqueada.",
  },
  {
    name: "suspicious-processes.txt",
    knowledge: "knowsMalwareFix",
    text: "Nueva pista descubierta: identificaste un proceso sospechoso en ejecucion.",
  },
  {
    name: "resolver.conf",
    minDifficulty: "medium",
    knowledge: "knowsDnsFix",
    text: "Reporte DNS analizado: puedes normalizar los reenviadores con 'fix dns'.",
  },
  {
    name: "system.log",
    minDifficulty: "medium",
    knowledge: "knowsServiceRestart",
    text: "Los logs indican que debes ejecutar 'restart services' tras estabilizar la red.",
  },
  {
    name: "switch.conf",
    exactDifficulty: "hard",
    knowledge: "knowsSwitchFix",
    text: "Configuracion de switch encontrada: habilita el puerto critico con 'enable port'.",
  },
  {
    name: "ops-note.txt",
    minDifficulty: "medium",
    knowledge: "knowsDnsDiagnostics",
    text: "Las notas operativas ordenan ejecutar 'diag dns' antes de aplicar cualquier fix.",
  },
  {
    name: "dns-runes.png",
    minDifficulty: "medium",
    knowledge: "knowsDnsDiagnostics",
    text: "El rompecabezas DNS confirma que la secuencia correcta es DIAG -> FIX.",
  },
  {
    name: "dns-lock.png",
    minDifficulty: "medium",
    knowledge: "knowsDnsOverride",
    text: "El candado DNS revela el override {{override}} necesario para desbloquear el fix.",
  },
  {
    name: "service-manual.txt",
    minDifficulty: "medium",
    knowledge: "knowsServicesVerification",
    text: "El playbook exige correr 'verify services' antes de 'restart services'.",
  },
  {
    name: "incident-template.txt",
    minDifficulty: "medium",
    knowledge: "knowsIncidentReport",
    text: "Necesitaras completar el informe ejecutando 'file report' tras los arreglos.",
  },
  {
    name: "switch-override.txt",
    exactDifficulty: "hard",
    knowledge: "knowsSwitchAudit",
    text: "Notas del switch: corre 'audit switch' antes de 'enable port'.",
  },
  {
    name: "tamper-photo.png",
    exactDifficulty: "hard",
    knowledge: "knowsPerimeterScan",
    text: "La foto del sello manipulado sugiere ejecutar 'scan perimeter'.",
  },
  {
    name: "perimeter-note.txt",
    exactDifficulty: "hard",
    knowledge: "knowsPerimeterScan",
    text: "El memo de perimetro exige documentar un 'scan perimeter' antes del cierre.",
  },
  {
    name: "chain-of-custody.txt",
    exactDifficulty: "hard",
    knowledge: "knowsIncidentReport",
    text: "La cadena de custodia detalla los datos requeridos por 'file report'.",
  },
  {
    name: "watchdog-brief.txt",
    exactDifficulty: "hard",
    knowledge: "knowsWatchdog",
    text: "El briefing del SOC exige desplegar un watchdog tras el escaneo perimetral.",
  },
] as const satisfies ReadonlyArray<KnowledgeHint>;
