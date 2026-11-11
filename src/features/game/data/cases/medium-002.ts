import type { CaseDefinition } from "@/features/game/types/game-engine";

export const medium002: CaseDefinition = {
  id: "MED-002",
  helpNote: "Algunas acciones deben descubrirse investigando los archivos.",

  files: [
    {
      name: "caso.txt",
      lines: [
        { text: "=== CASO: MEDIUM-002 ===", type: "hint" },
        "Incidencias encadenadas afectan la red interna.",
        "Investiga conectividad, DNS y servicios críticos.",
        "Pistas: revisa resolver.conf y system.log.",
      ],
    },
    {
      name: "network.txt",
      teaches: "knowsWifiFix",
      lines: [
        { text: "=== NETWORK REPORT ===", type: "hint" },
        "Autenticación WiFi incompleta.",
        "Nota: Reinicia la sesión de red para continuar.",
        { text: "Has reforzado el comando: fix wifi", type: "success" },
      ],
    },
    {
      name: "firewall.txt",
      teaches: "knowsFirewallFix",
      lines: [
        { text: "=== FIREWALL REPORT ===", type: "hint" },
        "Regla saliente bloqueando el panel interno.",
        "Nota: aplica la corrección estándar.",
        { text: "Has reforzado el comando: fix firewall", type: "success" },
      ],
    },
    {
      name: "suspicious-processes.txt",
      teaches: "knowsMalwareFix",
      lines: [
        { text: "=== PROCESS AUDIT ===", type: "hint" },
        "cryptominer.exe consume recursos críticos.",
        "Acción: finalizar proceso no autorizado.",
        { text: "Has reforzado el comando: kill malware", type: "success" },
      ],
    },
    {
      name: "resolver.conf",
      teaches: "knowsDnsFix",
      lines: [
        { text: "=== DNS RESOLVER ===", type: "hint" },
        { text: "Primary: 10.0.0.53 (degraded)", type: "hint" },
        { text: "Secondary: 8.8.8.8 (ok)", type: "hint" },
        "Acción sugerida: normalizar tablas DNS.",
        { text: "Has descubierto un comando útil: fix dns", type: "success" },
      ],
    },
    {
      name: "system.log",
      teaches: "knowsServiceRestart",
      lines: [
        { text: "=== SYSTEM LOG ===", type: "hint" },
        "[WARN] Servicios esperando reinicio coordinado.",
        "[INFO] Ejecutar playbook de reinicio supervisado.",
        {
          text: "Has descubierto un comando útil: restart services",
          type: "success",
        },
      ],
    },
    {
      name: "ops-note.txt",
      teaches: "knowsDnsDiagnostics",
      lines: [
        { text: "=== OPERATIONS NOTE ===", type: "hint" },
        "Los símbolos del rompecabezas DNS indican el orden correcto.",
        "Primero ejecuta 'diag dns', luego 'fix dns'.",
        {
          text: "Has registrado el procedimiento de diagnóstico.",
          type: "success",
        },
      ],
    },
    {
      name: "dns-runes.png",
      teaches: "knowsDnsDiagnostics",
      lines: [
        { text: "=== RUNAS DNS ===", type: "hint" },
        "Triángulo ➜ Medir ➜ Reparar.",
        "Traducción: ejecuta 'diag dns' antes de 'fix dns'.",
      ],
    },
    {
      name: "dns-lock.png",
      teaches: "knowsDnsOverride",
      lines: [
        { text: "=== DNS LOCK ===", type: "hint" },
        "Tres discos marcan la combinación {{override}}.",
        "Ingresa el override con 'enter override {{override}}'.",
      ],
    },
    {
      name: "service-manual.txt",
      teaches: "knowsServicesVerification",
      lines: [
        { text: "=== SERVICE PLAYBOOK ===", type: "hint" },
        "No reinicies nada sin pasar por 'verify services'.",
        "Cuando no haya alertas podrás usar 'restart services'.",
      ],
    },
    {
      name: "incident-template.txt",
      teaches: "knowsIncidentReport",
      lines: [
        { text: "=== INCIDENT REPORT TEMPLATE ===", type: "hint" },
        "Debes documentar DNS, servicios y verificaciones.",
        "Comando final: 'file report'.",
      ],
    },
  ],

  actions: [
    {
      command: "fix wifi",
      label: "WiFi",
      knowledge: "knowsWifiFix",
      unknown: [
        { text: "No tienes aún la secuencia para ese comando.", type: "error" },
        { text: "Revisa los archivos de red para aprenderla.", type: "hint" },
      ],
      objective: "wifiFixed",
      alreadyDone: "La conectividad WiFi ya estaba estable.",
      lines: [
        "Reiniciando autenticación WiFi...",
        { text: "Conectividad restaurada correctamente.", type: "success" },
      ],
    },
    {
      command: "fix firewall",
      label: "Firewall",
      knowledge: "knowsFirewallFix",
      unknown: [
        { text: "Aún no sabes cómo aplicar esa regla.", type: "error" },
        { text: "Busca pistas en firewall.txt.", type: "hint" },
      ],
      objective: "firewallFixed",
      alreadyDone: "El firewall ya tenía la política correcta.",
      lines: [
        "Aplicando política segura...",
        { text: "Reglas normalizadas sin bloqueos críticos.", type: "success" },
      ],
    },
    {
      command: "kill malware",
      label: "Malware",
      knowledge: "knowsMalwareFix",
      unknown: [
        { text: "Ese proceso sigue sin identificar.", type: "error" },
        { text: "Lee suspicious-processes.txt para más datos.", type: "hint" },
      ],
      objective: "malwareKilled",
      alreadyDone: "El malware ya fue detenido.",
      lines: [
        "Finalizando cryptominer.exe...",
        { text: "Proceso finalizado y recursos liberados.", type: "success" },
      ],
    },
    {
      command: "diag dns",
      label: "Diag DNS",
      knowledge: "knowsDnsDiagnostics",
      unknown: [
        {
          text: "No tienes aún el procedimiento de diagnóstico.",
          type: "error",
        },
        { text: "Revisa ops-note.txt o las runas DNS.", type: "hint" },
      ],
      objective: "dnsDiagnosticsComplete",
      alreadyDone: "Ya cuentas con la lectura de DNS más reciente.",
      lines: [
        "Ejecutando diagnóstico de DNS...",
        {
          text: "Reporte: latencia establecida, errores catalogados.",
          type: "success",
        },
      ],
    },
    {
      command: "enter override",
      label: "Override",
      knowledge: "knowsDnsOverride",
      unknown: [
        {
          text: "No conoces el procedimiento del override. Revisa el candado en dns-lock.png.",
          type: "error",
        },
      ],
      after: [
        {
          progress: ["dnsDiagnosticsComplete"],
          lines: [
            {
              text: "Debes ejecutar 'diag dns' antes de ingresar el override.",
              type: "error",
            },
          ],
        },
      ],
      objective: "overrideValidated",
      alreadyDone: "El override ya fue aceptado.",
      code: {
        value: "{{override}}",
        missing: [
          { text: "Debes indicar el código del override.", type: "error" },
        ],
        wrong: [
          {
            text: "Código incorrecto. Se registró un intento no autorizado sobre la consola DNS.",
            type: "error",
          },
        ],
        failure: {
          reason:
            "Ingresaste un código de override incorrecto en la consola DNS.",
          strike: true,
          effect: "scramble-labels",
        },
      },
      lines: [
        {
          text: "Override aceptado. Consola DNS desbloqueada.",
          type: "success",
        },
      ],
    },
    {
      command: "fix dns",
      label: "DNS",
      knowledge: "knowsDnsFix",
      unknown: [
        { text: "No tienes el procedimiento para reparar DNS.", type: "error" },
        { text: "Resolver.conf contiene la pista.", type: "hint" },
      ],
      after: [
        {
          progress: ["dnsDiagnosticsComplete"],
          lines: [
            {
              text: "Aún no has corrido 'diag dns'. Necesitas datos frescos antes de reparar.",
              type: "error",
            },
          ],
        },
        {
          progress: ["overrideValidated"],
          lines: [
            {
              text: "La consola sigue bloqueada. Ingresa el código del candado con 'enter override {{override}}'.",
              type: "error",
            },
          ],
        },
      ],
      objective: "dnsFixed",
      alreadyDone: "Las tablas DNS ya estaban estables.",
      lines: [
        "Normalizando caches y reenviadores...",
        { text: "DNS operativo con redundancia correcta.", type: "success" },
      ],
    },
    {
      command: "verify services",
      label: "Verificación servicios",
      knowledge: "knowsServicesVerification",
      unknown: [
        { text: "No tienes el playbook de verificación.", type: "error" },
        { text: "Revisa service-manual.txt.", type: "hint" },
      ],
      after: [
        {
          progress: ["wifiFixed", "firewallFixed", "malwareKilled", "dnsFixed"],
          lines: [
            {
              text: "Completa conectividad, firewall, malware y DNS antes de verificar servicios.",
              type: "error",
            },
          ],
        },
      ],
      objective: "servicesVerified",
      alreadyDone: "Las dependencias ya fueron verificadas.",
      lines: [
        "Ejecutando verificación de dependencias...",
        { text: "Servicios listos para reinicio coordinado.", type: "success" },
      ],
    },
    {
      command: "restart services",
      label: "Servicios",
      knowledge: "knowsServiceRestart",
      unknown: [
        { text: "Ese playbook no está disponible aún.", type: "error" },
        { text: "Los logs del sistema explican cómo usarlo.", type: "hint" },
      ],
      after: [
        {
          progress: ["servicesVerified"],
          lines: [
            {
              text: "Reiniciar servicios sin verificación previa habría comprometido la recuperación.",
              type: "error",
            },
            {
              text: "La acción quedó auditada como operación indebida.",
              type: "hint",
            },
          ],
          failure: {
            reason:
              "Intentaste reiniciar servicios críticos sin ejecutar 'verify services'.",
            strike: true,
            effect: "screen-obscure",
          },
        },
      ],
      objective: "servicesRestarted",
      alreadyDone: "El reinicio coordinado ya se ejecutó.",
      lines: [
        "Ejecutando playbook de servicios...",
        {
          text: "Servicios críticos reiniciados sin errores.",
          type: "success",
        },
      ],
    },
    {
      command: "file report",
      label: "Informe final",
      knowledge: "knowsIncidentReport",
      unknown: [
        { text: "No tienes el formato del informe.", type: "error" },
        {
          text: "Abre incident-template.txt para ver los requisitos.",
          type: "hint",
        },
      ],
      after: [
        {
          progress: ["servicesRestarted"],
          lines: [
            {
              text: "No puedes generar el informe sin reinicio exitoso.",
              type: "error",
            },
          ],
        },
      ],
      objective: "incidentReportFiled",
      alreadyDone: "El informe ya fue enviado.",
      lines: [
        "Compilando hallazgos finales...",
        { text: "Informe MED-002 archivado correctamente.", type: "success" },
      ],
    },
  ],

  destructive: {
    lines: [
      { text: "Comando destructivo detectado y rechazado.", type: "error" },
      {
        text: "El incidente escaló por una acción insegura en producción simulada.",
        type: "hint",
      },
    ],
    failure: {
      reason:
        "Intentaste ejecutar un comando destructivo en una infraestructura sensible.",
      strike: true,
      effect: "scramble-labels",
    },
  },

  submit: {
    pending: [
      {
        text: "Aún hay tareas pendientes. Ejecuta 'status' para revisarlas.",
        type: "error",
      },
    ],
    done: [
      "Validando servicios y monitoreo...",
      {
        text: "Todos los componentes responden correctamente.",
        type: "success",
      },
      { text: "Caso 002 resuelto. Buen trabajo.", type: "success" },
    ],
  },
};
