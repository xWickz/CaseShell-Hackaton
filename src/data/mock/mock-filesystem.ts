import type { DesktopItem, Difficulty } from "@/types/game";

const easyDesktopItems: DesktopItem[] = [
  {
    id: "terminal-main",
    name: "Terminal",
    type: "terminal",
  },
  {
    id: "case-file",
    name: "caso.txt",
    type: "text",
    content: `INCIDENTE 001 - EASY

La oficina no puede conectarse al panel interno de CubePath.
Tu misión es investigar el entorno, revisar archivos y restaurar el servicio.

Objetivos:
- Verificar conectividad
- Revisar reglas de firewall
- Detectar posibles procesos sospechosos

Pistas:
- Revisa las notas del junior
- Inspecciona la carpeta config
- Examina los logs del sistema
- No asumas que el problema es solo el router`,
  },
  {
    id: "junior-note",
    name: "nota_junior.txt",
    type: "text",
    content: `Notas rápidas del junior:

- El router parece estable físicamente
- Creo que el firewall está muy agresivo...
- No recuerdo si terminé la configuración del WiFi
- Dejé algo importante en config/network.txt
- También vi algo raro en los logs, pero no lo revisé completo`,
  },
  {
    id: "router-image",
    name: "router-photo.png",
    type: "image",
    imageUrl: "https://placehold.co/800x500/111827/ffffff?text=Router+Photo",
  },
  {
    id: "config-folder",
    name: "config",
    type: "folder",
    children: [
      {
        id: "network-file",
        name: "network.txt",
        type: "text",
        content: `CONFIG DE RED

SSID: OfficeNet
PASSWORD: ********
STATUS: PENDING SETUP

Observaciones:
- La autenticación no terminó correctamente
- La conexión debe reiniciarse manualmente

Comando anotado:
- fix wifi`,
      },
      {
        id: "firewall-file",
        name: "firewall.txt",
        type: "text",
        content: `REGLAS DE FIREWALL

- Puerto 443 bloqueado
- Puerto 8080 permitido
- Política por defecto: DENY

Observaciones:
- El panel interno depende de tráfico saliente seguro
- Hay una regla restrictiva aplicada por error

Comando anotado:
- fix firewall`,
      },
    ],
  },
  {
    id: "logs-folder",
    name: "logs",
    type: "folder",
    children: [
      {
        id: "system-log",
        name: "system.log",
        type: "text",
        content: `SYSTEM LOG

[WARN] DNS fallback failed
[WARN] Firewall rule conflict detected
[WARN] Unusual CPU spike detected
[INFO] Awaiting manual intervention`,
      },
      {
        id: "suspicious-processes-file",
        name: "suspicious-processes.txt",
        type: "text",
        content: `PROCESS AUDIT

Proceso detectado: cryptominer.exe
Estado: RUNNING
Uso de CPU: 87%
Conexiones externas: múltiples

Observaciones:
- Proceso no autorizado
- Debe finalizarse para estabilizar el sistema

Comando anotado:
- kill malware`,
      },
    ],
  },
];

const mediumDesktopItems: DesktopItem[] = [
  ...easyDesktopItems,
  {
    id: "dns-folder",
    name: "dns",
    type: "folder",
    children: [
      {
        id: "resolver-file",
        name: "resolver.conf",
        type: "text",
        content: `DNS RESOLVER

primary=10.0.0.53
secondary=8.8.8.8
status=degraded

Nota:
- Hay fallos intermitentes de resolución`,
      },
    ],
  },
  {
    id: "ops-note",
    name: "ops-note.txt",
    type: "text",
    content: `OPERATIONS NOTE

Antes de tocar DNS debes recopilar pruebas.
Los símbolos en dns-runes.png indican el orden correcto.
El candado en dns-lock.png muestra el override numérico que debes ingresar.

Procedimiento:
1. Ejecuta 'diag dns' para obtener la lectura actual.
2. Ingresa el código del candado usando 'enter override 884'.
3. Solo después aplica 'fix dns'.
4. Documenta los hallazgos en incident-template.txt.

Recordatorio: no reinicies servicios sin verificar la capa de aplicación.`,
  },
  {
    id: "dns-runes",
    name: "dns-runes.png",
    type: "image",
    imageUrl:
      "https://placehold.co/900x520/0f172a/38bdf8?text=DNS+Runes+Puzzle",
  },
  {
    id: "dns-lock",
    name: "dns-lock.png",
    type: "image",
    imageUrl:
      "https://placehold.co/900x520/082f49/93c5fd?text=Override+Lock",
  },
  {
    id: "service-manual",
    name: "service-manual.txt",
    type: "text",
    content: `SERVICE PLAYBOOK

Condiciones previas:
- WiFi estable
- Firewall normalizado
- Malware removido
- DNS diagnosticado y reparado

Secuencia:
1. Ejecuta 'verify services' para revisar dependencias.
2. Si no hay alertas, usa 'restart services'.

Nota del SRE: si saltas el paso de verificación, el reinicio fallará.`,
  },
  {
    id: "incident-template",
    name: "incident-template.txt",
    type: "text",
    content: `INCIDENT REPORT TEMPLATE

Resumen mínimo:
- Estado final de conectividad
- Cambios aplicados en DNS y servicios
- Evidencia de verificación

Para cerrar el incidente ejecuta 'file report' después del reinicio exitoso.`,
  },
];

const hardDesktopItems: DesktopItem[] = [
  ...mediumDesktopItems,
  {
    id: "infra-folder",
    name: "infra",
    type: "folder",
    children: [
      {
        id: "switch-config",
        name: "switch.conf",
        type: "text",
        content: `SWITCH CONFIG

VLAN 10 active
VLAN 20 active
Port 4 disabled manually

Observación:
- El puerto del servidor fue alterado durante mantenimiento`,
      },
    ],
  },
  {
    id: "switch-override",
    name: "switch-override.txt",
    type: "text",
    content: `SWITCH OVERRIDE NOTES

El puerto crítico quedó bloqueado tras un cambio manual.

Checklist:
- Ejecuta 'audit switch' para confirmar el estado de VLAN y enlaces.
- Solo después puedes usar 'enable port'.

El diagrama en tamper-photo.png muestra el sello de seguridad alterado.`,
  },
  {
    id: "tamper-photo",
    name: "tamper-photo.png",
    type: "image",
    imageUrl:
      "https://placehold.co/900x520/111827/facc15?text=Tamper+Evidence",
  },
  {
    id: "perimeter-note",
    name: "perimeter-note.txt",
    type: "text",
    content: `PERIMETER CHECK NOTE

Se detectaron picos desde hosts externos.

Acción requerida:
- Ejecuta 'scan perimeter' tras eliminar el malware.
- Registra el resultado en el informe final.

Sin este escaneo no se firmará el cierre del caso.`,
  },
  {
    id: "chain-custody",
    name: "chain-of-custody.txt",
    type: "text",
    content: `CHAIN OF CUSTODY

Elementos que deben constar en el informe:
- Diagnósticos de DNS
- Evidencia del escaneo perimetral
- Número de puerto reactivado

Comando final: 'file report' (requiere datos de los pasos anteriores).`,
  },
  {
    id: "watchdog-brief",
    name: "watchdog-brief.txt",
    type: "text",
    content: `WATCHDOG BRIEF

Tras el escaneo perimetral el SOC exige desplegar un watchdog.

Acciones:
1. Ejecuta 'deploy watchdog' una vez que 'scan perimeter' termine.
2. Registra el token emitido para adjuntarlo al informe final.

Sin el watchdog activo el incidente no puede cerrarse.`,
  },
];

export const mockDesktopItemsByDifficulty: Record<Difficulty, DesktopItem[]> = {
  easy: easyDesktopItems,
  medium: mediumDesktopItems,
  hard: hardDesktopItems,
};
