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
];

export const mockDesktopItemsByDifficulty: Record<Difficulty, DesktopItem[]> = {
  easy: easyDesktopItems,
  medium: mediumDesktopItems,
  hard: hardDesktopItems,
};
