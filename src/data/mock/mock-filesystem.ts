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
    content: `INCIDENTE 1 - ACCESO DENEGADO

Situación:

No entendemos aún porque a estas alturas la empresa decide seguir metiendo juniors sin experiencia laboral. En fin, tampoco entiendo porque les dan comandos privilegiados. Bueno, sea quien sea que este leyendo esto en caso de que algún junior vuelva a toquetear cosas sin saber, aquí dejo unas notas del manager:

En caso de que la oficina no pueda conectarse al panel interno de CubePath.
Tu misión es investigar el entorno, revisar archivos y restaurar el servicio.

Objetivos: (no cambiar el orden)
- Verificar conectividad
- Revisar reglas de firewall (IMPORTANTE)
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

Hoy es mi primer día de trabajo y ya me metí en problemas... el panel interno no carga y no tengo ni idea de por qué. Revisé el router y parece estar bien, pero no soy experto en eso. El firewall me parece que está bloqueando algo, aunque no estoy seguro de qué. También intenté reiniciar la conexión WiFi, pero no funcionó. Dejé algunas notas en los archivos de configuración por si sirven de algo.

- El router parece estable físicamente
- Creo que el firewall está muy agresivo... ¿Cómo funciona esta cosa?
- No recuerdo si terminé la configuración del WiFi 
- Dejé algo importante en la carpeta de configuración, pero no recuerdo qué era
- También vi algo raro en los logs, pero no lo revisé completo porque no entendí gran parte de lo que decía`,
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

SSID: PHERALB_BANEADO
PASSWORD: ********
STATUS: PENDING SETUP

Observaciones:
- La autenticación no terminó correctamente
- La conexión debe reiniciarse manualmente

¿Qué? Porque no se ha conectado? es que me falta algún comando? esto de ser junior se esta yendo de las manos, no se ni siquiera como funciona el wifi, lo único que hice fue poner la contraseña y el nombre de la red, ¿no debería ser suficiente? bueno, dejé anotado un comando por si acaso, aunque no tengo ni la más menor idea de para qué sirve:

- fix wifi`,
      },
      {
        id: "firewall-file",
        name: "firewall.txt",
        type: "text",
        content: `REGLAS DE FIREWALL

He estado indagando un poco y creo que el firewall es el culpable de que el panel no cargue, pero no entiendo mucho de esto, así que no estoy seguro. Dejo aquí mis notas por si sirven de algo:

- Puerto 443 bloqueado
- Puerto 8080 permitido
- Política por defecto: DENY

Entonces, si el puerto 443 está bloqueado, ¿cómo se supone que el panel va a cargar? no entiendo nada de esto, pero creo que hay un comando para arreglarlo, aunque no tengo ni la más menor idea de cómo usarlo o qué hace exactamente:

Observaciones:
- El panel interno depende de tráfico saliente seguro
- Hay una regla restrictiva aplicada por error

Bueno, espero que esto sirva de algo, aunque no tengo ni la más menor idea de cómo funciona el firewall, lo único que hice fue revisar las reglas y anotar lo que vi, no tengo ni la más menor idea de qué hacer con esta información, pero bueno, aquí está:

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
        content: `SYSTEM LOG - Últimos eventos registrados

[WARN] DNS fallback failed
[WARN] Firewall rule conflict detected
[WARN] Unusual CPU spike detected
[INFO] Awaiting manual intervention

Notas del junior: 

- El sistema está esperando que alguien haga algo para resolver los problemas
- No entiendo muy bien los logs, pero parece que hay varios problemas ocurriendo al mismo tiempo
- El firewall tiene una regla conflictiva que podría estar causando problemas
- También hay un pico inusual de CPU que no sé qué significa, pero lo anoté por si sirve de algo`,
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

¡OYE! ¿Qué es esto? No tengo ni la más menor idea de qué es esto, pero suena muy mal, así que lo anoté por si sirve de algo:

No debería estar corriendo ningún proceso sospechoso en el sistema, y este cryptominer.exe definitivamente suena como algo que no debería estar ahí, además de que está usando un montón de CPU y tiene conexiones externas activas, lo cual es muy sospechoso. No tengo ni la más menor idea de cómo llegó ahí o qué hace exactamente, pero creo que hay un comando para lidiar con esto, aunque no tengo ni la más menor idea de cómo usarlo o qué hace exactamente:

Como es que esto consume tanta CPU? ni siquiera sé qué es un proceso sospechoso, pero esto suena como algo que podría estar causando problemas en el sistema, así que lo anoté por si sirve de algo:

Observaciones:
- Proceso no autorizado
- Debe finalizarse para estabilizar el sistema

Me soplaron en la oficina de un comando que quizás puede solucionar esto, aunque no tengo ni la más menor idea de cómo usarlo o qué hace exactamente, pero bueno, aquí está:

- kill malware`,
      },
    ],
  },
  {
    id: "helpful-links",
    name: "links_útiles.txt",
    type: "text",
    content: `LINKS ÚTILES
Aquí dejo algunos links que podrían ser útiles para investigar el caso, aunque no tengo ni la más menor idea de qué son o cómo funcionan, pero bueno, aquí están por si sirven de algo:
- Documentación de comandos: https://cubepath.com/terminal-commands
- Guía de solución de problemas: https://cubepath.com/troubleshooting-guide
- Foro de soporte interno: https://cubepath.com/internal-support-forum
No tengo ni la más menor idea de qué son estos links o cómo podrían ayudar, pero quizás alguien con más experiencia pueda encontrar algo útil ahí, así que los dejo anotados por si sirven de algo.`,
  },
  {
    id: "random-text-01",
    name: "importante.txt",
    type: "text",
    content: `Procedo a anotar mis cosas importantes aquí, espero que nadie husme mi escritorio...
    
- Cumpleaños de mamá: 12 de octubre
- Película para ver el fin de semana: Inception
- Lista de compras: leche, pan, huevos
- Contraseña de mi Netflix: ********`,
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
    imageUrl: "https://placehold.co/900x520/082f49/93c5fd?text=Override+Lock",
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
    imageUrl: "https://placehold.co/900x520/111827/facc15?text=Tamper+Evidence",
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
