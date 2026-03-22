import type { Difficulty } from "@/types/game";
import type { CaseProgress } from "@/types/game-engine";

export type ChatSpeaker = "ops" | "mentor" | "system";

type ProgressKey = keyof CaseProgress;

type ChatCondition =
  | { type: "always" }
  | { type: "progress"; key: ProgressKey }
  | { type: "all"; keys: ProgressKey[] }
  | { type: "completion" };

export type ChatScriptEntry = {
  id: string;
  speaker: ChatSpeaker;
  text: string;
  condition: ChatCondition;
  commandHint?: string;
};

const always = (): ChatCondition => ({ type: "always" });
const progress = (key: ProgressKey): ChatCondition => ({
  type: "progress",
  key,
});
const all = (keys: ProgressKey[]): ChatCondition => ({ type: "all", keys });

export const chatScripts: Record<Difficulty, ChatScriptEntry[]> = {
  easy: [
    {
      id: "intro",
      speaker: "ops",
      text: "SOC// Bienvenido a la consola de CubePath. Necesitamos el panel interno en línea YA.",
      condition: always(),
    },
    {
      id: "hint-wifi",
      speaker: "mentor",
      text: "Recuerda revisar las notas de red. Hay un comando para rearmar el WiFi.",
      condition: always(),
      commandHint: "fix wifi",
    },
    {
      id: "wifi-done",
      speaker: "ops",
      text: "Perfecto, la conectividad volvió a responder. Continúa con las reglas del firewall.",
      condition: progress("wifiFixed"),
    },
    {
      id: "firewall-done",
      speaker: "ops",
      text: "El tráfico seguro está limpio. Falta neutralizar el proceso que drena CPU.",
      condition: progress("firewallFixed"),
      commandHint: "kill malware",
    },
    {
      id: "malware-done",
      speaker: "mentor",
      text: "cryptominer.exe fuera de combate. Ejecuta 'status' y prepara el submit.",
      condition: progress("malwareKilled"),
      commandHint: "status",
    },
    {
      id: "easy-ready",
      speaker: "ops",
      text: "Todos los checks en verde. Envía el reporte cuando quieras.",
      condition: all(["wifiFixed", "firewallFixed", "malwareKilled"]),
      commandHint: "submit",
    },
  ],
  medium: [
    {
      id: "intro",
      speaker: "ops",
      text: "Caso MED-002: la fuga de datos sigue activa. Necesitamos cadena completa de evidencias.",
      condition: always(),
    },
    {
      id: "dns-reminder",
      speaker: "mentor",
      text: "No toques DNS sin correr 'diag dns' y desbloquear la consola.",
      condition: always(),
      commandHint: "diag dns",
    },
    {
      id: "wifi-done",
      speaker: "ops",
      text: "La red quedó estable. Ve a por el firewall y mata el proceso sospechoso.",
      condition: progress("wifiFixed"),
    },
    {
      id: "dns-ready",
      speaker: "mentor",
      text: "Con diag+override hechos ya puedes aplicar 'fix dns'.",
      condition: all(["dnsDiagnosticsComplete", "overrideValidated"]),
      commandHint: "fix dns",
    },
    {
      id: "dns-done",
      speaker: "ops",
      text: "Resolución limpia. Falta verificar dependencias antes de reiniciar servicios.",
      condition: progress("dnsFixed"),
      commandHint: "verify services",
    },
    {
      id: "services-restarted",
      speaker: "ops",
      text: "Servicios arrancaron sin alertas. Documenta todo y archiva el informe.",
      condition: progress("servicesRestarted"),
      commandHint: "file report",
    },
    {
      id: "medium-ready",
      speaker: "mentor",
      text: "Checklist completo. Ejecuta 'submit' para cerrar MED-002.",
      condition: all([
        "wifiFixed",
        "firewallFixed",
        "malwareKilled",
        "dnsFixed",
        "servicesRestarted",
        "incidentReportFiled",
      ]),
      commandHint: "submit",
    },
  ],
  hard: [
    {
      id: "intro",
      speaker: "ops",
      text: "Incidente HARD-003. Hay sabotaje físico y tráfico anómalo. Mantén abierto este canal.",
      condition: always(),
    },
    {
      id: "switch-warning",
      speaker: "mentor",
      text: "El puerto del switch está muerto. No lo habilites sin 'audit switch'.",
      condition: always(),
    },
    {
      id: "dns-chain",
      speaker: "ops",
      text: "Diag ➜ Override ➜ Fix. Necesitamos ese orden documentado.",
      condition: always(),
      commandHint: "diag dns",
    },
    {
      id: "perimeter-reminder",
      speaker: "mentor",
      text: "Cuando limpies el malware, ejecuta 'scan perimeter' y registra el token del watchdog.",
      condition: always(),
    },
    {
      id: "dns-stable",
      speaker: "ops",
      text: "DNS volvió a respirar. Avanza con verificación y reinicio de servicios.",
      condition: progress("dnsFixed"),
      commandHint: "verify services",
    },
    {
      id: "services-restarted",
      speaker: "ops",
      text: "Servicios reiniciados. Audita el switch antes de levantar el puerto 4.",
      condition: progress("servicesRestarted"),
      commandHint: "audit switch",
    },
    {
      id: "perimeter-done",
      speaker: "mentor",
      text: "Perímetro escaneado. Despliega el watchdog para monitoreo continuo.",
      condition: progress("perimeterScanComplete"),
      commandHint: "deploy watchdog",
    },
    {
      id: "watchdog-done",
      speaker: "ops",
      text: "Watchdog activo. Falta habilitar el puerto y documentar cadena de custodia.",
      condition: progress("watchdogDeployed"),
      commandHint: "enable port",
    },
    {
      id: "port-enabled",
      speaker: "mentor",
      text: "Puerto activo. Genera el informe final y cierra el incidente.",
      condition: progress("switchPortEnabled"),
      commandHint: "file report",
    },
    {
      id: "hard-ready",
      speaker: "ops",
      text: "Checklist total completado. El SOC espera el submit.",
      condition: all([
        "wifiFixed",
        "firewallFixed",
        "malwareKilled",
        "dnsFixed",
        "servicesRestarted",
        "switchPortEnabled",
        "perimeterScanComplete",
        "watchdogDeployed",
        "incidentReportFiled",
      ]),
      commandHint: "submit",
    },
  ],
};

export const isConditionMet = (
  condition: ChatCondition,
  progress: CaseProgress,
): boolean => {
  switch (condition.type) {
    case "always":
      return true;
    case "progress":
      return Boolean(progress[condition.key]);
    case "all":
      return condition.keys.every((key) => Boolean(progress[key]));
    case "completion":
      return Boolean(progress.completed);
    default:
      return false;
  }
};
