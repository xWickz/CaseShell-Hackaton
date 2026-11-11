import type { CaseDefinition } from "@/features/game/types/game-engine";

export const easy001: CaseDefinition = {
  id: "EASY-001",
  helpNote: "Algunos comandos avanzados deben descubrirse leyendo pistas.",
  helpListsFiles: true,

  files: [
    {
      name: "caso.txt",
      lines: [
        { text: "=== CASO: EASY-001 ===", type: "hint" },
        "Un junior reporta que el panel interno no carga.",
        "Debes revisar conectividad, firewall y procesos sospechosos.",
        "Pistas: revisa network.txt, firewall.txt y suspicious-processes.txt.",
      ],
    },
    {
      name: "network.txt",
      teaches: "knowsWifiFix",
      lines: [
        { text: "=== NETWORK REPORT ===", type: "hint" },
        "SSID detectado, pero no hay autenticación completa.",
        "Nota del junior: 'creo que falta volver a levantar la conexión'.",
        { text: "Has descubierto un comando útil: fix wifi", type: "success" },
      ],
    },
    {
      name: "firewall.txt",
      teaches: "knowsFirewallFix",
      lines: [
        { text: "=== FIREWALL REPORT ===", type: "hint" },
        "Regla restrictiva bloqueando tráfico saliente del panel.",
        "Nota interna: 'aplica la corrección estándar del firewall'.",
        {
          text: "Has descubierto un comando útil: fix firewall",
          type: "success",
        },
      ],
    },
    {
      name: "suspicious-processes.txt",
      teaches: "knowsMalwareFix",
      lines: [
        { text: "=== PROCESS AUDIT ===", type: "hint" },
        "Proceso sospechoso detectado: cryptominer.exe",
        "Consumo anómalo de recursos y conexiones externas activas.",
        {
          text: "Has descubierto un comando útil: kill malware",
          type: "success",
        },
      ],
    },
  ],

  actions: [
    {
      command: "fix wifi",
      label: "WiFi",
      knowledge: "knowsWifiFix",
      objective: "wifiFixed",
      alreadyDone: "La conectividad WiFi ya estaba corregida.",
      lines: [
        "Reiniciando autenticación de red...",
        {
          text: "Conectividad WiFi restaurada correctamente.",
          type: "success",
        },
      ],
    },
    {
      command: "fix firewall",
      label: "Firewall",
      knowledge: "knowsFirewallFix",
      objective: "firewallFixed",
      alreadyDone: "El firewall ya estaba corregido.",
      lines: [
        "Aplicando política segura del firewall...",
        {
          text: "Firewall corregido. El tráfico del panel ya no está bloqueado.",
          type: "success",
        },
      ],
    },
    {
      command: "kill malware",
      label: "Malware",
      knowledge: "knowsMalwareFix",
      objective: "malwareKilled",
      alreadyDone: "El proceso malicioso ya fue detenido.",
      lines: [
        "Finalizando proceso: cryptominer.exe...",
        { text: "Proceso malicioso detenido correctamente.", type: "success" },
      ],
    },
  ],

  destructive: {
    lines: [
      { text: "Comando destructivo detectado y bloqueado.", type: "error" },
      {
        text: "La consola registró un intento inseguro. El SOC ha emitido una advertencia.",
        type: "hint",
      },
    ],
    failure: {
      reason:
        "Intentaste ejecutar un comando destructivo en un entorno de investigación activo.",
      strike: true,
    },
  },

  submit: {
    pending: [
      {
        text: "Aún no puedes cerrar el caso. Revisa 'status' y completa lo pendiente.",
        type: "error",
      },
    ],
    done: [
      "Validando estado final del sistema...",
      { text: "Todos los servicios están operativos.", type: "success" },
      {
        text: "¡Caso resuelto! Reporte enviado correctamente.",
        type: "success",
      },
    ],
  },
};
