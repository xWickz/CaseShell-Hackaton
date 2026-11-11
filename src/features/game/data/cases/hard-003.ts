import type { CaseDefinition } from "@/features/game/types/game-engine";

export const hard003: CaseDefinition = {
  id: "HARD-003",
  helpNote: "Lee cada archivo; esconden pasos críticos.",

  files: [
    {
      name: "caso.txt",
      lines: [
        { text: "=== CASO: HARD-003 ===", type: "hint" },
        "Fallos encadenados afectan panel, DNS y switching.",
        { text: "Además hay sabotaje en la infraestructura.", type: "hint" },
        {
          text: "Revisa resolver.conf, system.log y switch.conf.",
          type: "hint",
        },
      ],
    },
    {
      name: "network.txt",
      teaches: "knowsWifiFix",
      lines: [
        { text: "=== NETWORK REPORT ===", type: "hint" },
        "Autenticación WiFi inconclusa.",
        "Restaurar conexión antes de tocar DNS.",
        { text: "Has reforzado el comando: fix wifi", type: "success" },
      ],
    },
    {
      name: "firewall.txt",
      teaches: "knowsFirewallFix",
      lines: [
        { text: "=== FIREWALL REPORT ===", type: "hint" },
        "Bloqueo saliente detectado",
        "Reaplicar política corporativa estándar.",
        { text: "Has reforzado el comando: fix firewall", type: "success" },
      ],
    },
    {
      name: "suspicious-processes.txt",
      teaches: "knowsMalwareFix",
      lines: [
        { text: "=== PROCESS AUDIT ===", type: "hint" },
        "Proceso malicioso mantiene CPU en 90%.",
        "Eliminar para estabilizar servicios.",
        { text: "Has reforzado el comando: kill malware", type: "success" },
      ],
    },
    {
      name: "resolver.conf",
      teaches: "knowsDnsFix",
      lines: [
        { text: "=== DNS RESOLVER ===", type: "hint" },
        "Primario degradado, secundario estable.",
        "Acción: limpiar caches y ajustar reenviadores.",
        { text: "Has descubierto un comando útil: fix dns", type: "success" },
      ],
    },
    {
      name: "system.log",
      teaches: "knowsServiceRestart",
      lines: [
        { text: "=== SYSTEM LOG ===", type: "hint" },
        "[WARN] Reinicio coordinado pendiente",
        "[WARN] Switch reports link down port4",
        "Playbook: restart services tras arreglar redes.",
        {
          text: "Has descubierto un comando útil: restart services",
          type: "success",
        },
      ],
    },
    {
      name: "switch.conf",
      teaches: "knowsSwitchFix",
      lines: [
        { text: "=== SWITCH CONFIG ===", type: "hint" },
        "VLAN10 y VLAN20 activas",
        { text: "Puerto 4 deshabilitado manualmente", type: "hint" },
        "Acción requerida: habilitar puerto crítico.",
        {
          text: "Has descubierto un comando útil: enable port",
          type: "success",
        },
      ],
    },
    {
      name: "ops-note.txt",
      teaches: "knowsDnsDiagnostics",
      lines: [
        { text: "=== OPERATIONS NOTE ===", type: "hint" },
        "Secuencia requerida: 'diag dns' ➜ 'enter override {{override}}' ➜ 'fix dns'.",
        "No reinicies servicios sin la verificación previa.",
      ],
    },
    {
      name: "dns-runes.png",
      teaches: "knowsDnsDiagnostics",
      lines: [
        { text: "=== RUNAS DNS ===", type: "hint" },
        "Las runas remarcan la misma secuencia: Medir ➜ Desbloquear ➜ Reparar.",
      ],
    },
    {
      name: "dns-lock.png",
      teaches: "knowsDnsOverride",
      lines: [
        { text: "=== DNS LOCK ===", type: "hint" },
        "Tres discos muestran la combinación {{override}}.",
        "Usa 'enter override {{override}}' tras el diagnóstico.",
      ],
    },
    {
      name: "service-manual.txt",
      teaches: "knowsServicesVerification",
      lines: [
        { text: "=== SERVICE PLAYBOOK ===", type: "hint" },
        "'verify services' es obligatorio antes de 'restart services'.",
      ],
    },
    {
      name: "incident-template.txt",
      teaches: "knowsIncidentReport",
      lines: [
        { text: "=== INCIDENT TEMPLATE ===", type: "hint" },
        "El informe debe incluir DNS, perímetro y switching.",
        "Cierra con 'file report'.",
      ],
    },
    {
      name: "perimeter-note.txt",
      teaches: "knowsPerimeterScan",
      lines: [
        { text: "=== PERIMETER NOTE ===", type: "hint" },
        "Ejecuta 'scan perimeter' después de eliminar el malware.",
        "Sin ese registro el SOC no firma el cierre.",
      ],
    },
    {
      name: "switch-override.txt",
      teaches: "knowsSwitchAudit",
      lines: [
        { text: "=== SWITCH OVERRIDE ===", type: "hint" },
        "Asegura 'audit switch' antes de habilitar el puerto.",
      ],
    },
    {
      name: "chain-of-custody.txt",
      teaches: "knowsIncidentReport",
      lines: [
        { text: "=== CHAIN OF CUSTODY ===", type: "hint" },
        "El informe debe citar el puerto habilitado y el escaneo perimetral.",
      ],
    },
    {
      name: "watchdog-brief.txt",
      teaches: "knowsWatchdog",
      lines: [
        { text: "=== WATCHDOG BRIEF ===", type: "hint" },
        "Despliega el watchdog con 'deploy watchdog' tras 'scan perimeter'.",
      ],
    },
  ],

  actions: [
    {
      command: "fix wifi",
      label: "WiFi",
      knowledge: "knowsWifiFix",
      unknown: [
        { text: "No conoces la secuencia para ese comando.", type: "error" },
        { text: "Revisa los archivos de red.", type: "hint" },
      ],
      objective: "wifiFixed",
      alreadyDone: "La red WiFi ya estaba estable.",
      lines: [
        "Reiniciando autenticación WiFi...",
        { text: "Conectividad WiFi estabilizada.", type: "success" },
      ],
    },
    {
      command: "fix firewall",
      label: "Firewall",
      knowledge: "knowsFirewallFix",
      unknown: [
        {
          text: "No tienes autorización aún para tocar el firewall.",
          type: "error",
        },
        { text: "Consulta firewall.txt.", type: "hint" },
      ],
      objective: "firewallFixed",
      alreadyDone: "El firewall ya fue ajustado.",
      lines: [
        "Aplicando plantilla segura...",
        { text: "Tráfico saliente normalizado.", type: "success" },
      ],
    },
    {
      command: "kill malware",
      label: "Malware",
      knowledge: "knowsMalwareFix",
      unknown: [
        { text: "Necesitas más información del proceso.", type: "error" },
        { text: "Lee suspicious-processes.txt.", type: "hint" },
      ],
      objective: "malwareKilled",
      alreadyDone: "El proceso malicioso ya no corre.",
      lines: [
        "Eliminando cryptominer.exe...",
        { text: "Proceso detenido y recursos liberados.", type: "success" },
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
      alreadyDone: "El diagnóstico de DNS ya está actualizado.",
      lines: [
        "Ejecutando diagnóstico de DNS...",
        { text: "Errores catalogados, métricas capturadas.", type: "success" },
      ],
    },
    {
      command: "enter override",
      label: "Override",
      knowledge: "knowsDnsOverride",
      unknown: [
        {
          text: "No conoces el procedimiento del override. Consulta dns-lock.png.",
          type: "error",
        },
      ],
      after: [
        {
          progress: ["dnsDiagnosticsComplete"],
          lines: [
            {
              text: "Ejecuta 'diag dns' antes de ingresar el override.",
              type: "error",
            },
          ],
        },
      ],
      objective: "overrideValidated",
      alreadyDone: "El override ya fue aceptado.",
      code: {
        value: "{{override}}",
        missing: [{ text: "Indica el código del override.", type: "error" }],
        wrong: [
          {
            text: "Código incorrecto. La consola DNS registró un intento inválido.",
            type: "error",
          },
        ],
        failure: {
          reason:
            "Ingresaste un código de override inválido en una consola crítica.",
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
        { text: "No conoces el procedimiento de DNS.", type: "error" },
        { text: "Resolver.conf contiene instrucciones.", type: "hint" },
      ],
      after: [
        {
          progress: ["wifiFixed", "firewallFixed"],
          lines: [
            {
              text: "Asegura red y firewall antes de tocar DNS.",
              type: "error",
            },
            { text: "Consulta 'status' para el orden sugerido.", type: "hint" },
          ],
        },
        {
          progress: ["dnsDiagnosticsComplete"],
          lines: [
            {
              text: "Falta un diagnóstico reciente. Ejecuta 'diag dns'.",
              type: "error",
            },
          ],
        },
        {
          progress: ["overrideValidated"],
          lines: [
            {
              text: "La consola de DNS sigue bloqueada. Usa 'enter override {{override}}'.",
              type: "error",
            },
          ],
        },
      ],
      objective: "dnsFixed",
      alreadyDone: "Los reenviadores DNS ya son estables.",
      lines: [
        "Reconfigurando reenviadores y limpiando caches...",
        { text: "DNS estabilizado y redundante.", type: "success" },
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
        { text: "Ese playbook aún no está autorizado.", type: "error" },
        { text: "System.log explica cuándo ejecutarlo.", type: "hint" },
      ],
      after: [
        {
          progress: ["servicesVerified"],
          lines: [
            {
              text: "Intentaste reiniciar servicios críticos sin verificación previa.",
              type: "error",
            },
            {
              text: "El sistema registró la acción como operación insegura.",
              type: "hint",
            },
          ],
          failure: {
            reason:
              "Intentaste ejecutar 'restart services' sin pasar antes por 'verify services'.",
            strike: true,
            effect: "screen-obscure",
          },
        },
      ],
      objective: "servicesRestarted",
      alreadyDone: "El reinicio orquestado ya fue aplicado.",
      lines: [
        "Ejecutando playbook de servicios...",
        { text: "Servicios críticos activos nuevamente.", type: "success" },
      ],
    },
    {
      command: "scan perimeter",
      label: "Perímetro",
      knowledge: "knowsPerimeterScan",
      unknown: [
        { text: "No hay orden para ese escaneo.", type: "error" },
        {
          text: "Consulta perimeter-note.txt o tamper-photo.png.",
          type: "hint",
        },
      ],
      after: [
        {
          progress: ["malwareKilled"],
          lines: [
            {
              text: "El malware sigue activo. El SOC no permite el escaneo aún.",
              type: "error",
            },
          ],
        },
      ],
      objective: "perimeterScanComplete",
      alreadyDone: "El perímetro ya fue escaneado.",
      lines: [
        "Escaneando perímetro externo...",
        { text: "Anomalías controladas. Informe listo.", type: "success" },
      ],
    },
    {
      command: "audit switch",
      label: "Auditoría switch",
      knowledge: "knowsSwitchAudit",
      unknown: [
        { text: "No tienes el checklist de auditoría.", type: "error" },
        { text: "Revisa switch-override.txt.", type: "hint" },
      ],
      after: [
        {
          progress: ["servicesRestarted"],
          lines: [
            {
              text: "Completa el reinicio coordinado antes de auditar el switch.",
              type: "error",
            },
          ],
        },
      ],
      objective: "switchAuditComplete",
      alreadyDone: "La auditoría del switch ya se completó.",
      lines: [
        "Auditoría de VLAN y puertos en curso...",
        {
          text: "Switch listo para habilitar el puerto crítico.",
          type: "success",
        },
      ],
    },
    {
      command: "deploy watchdog",
      label: "Watchdog",
      knowledge: "knowsWatchdog",
      unknown: [
        {
          text: "No tienes autorización para desplegar el watchdog.",
          type: "error",
        },
        { text: "Lee watchdog-brief.txt.", type: "hint" },
      ],
      after: [
        {
          progress: ["perimeterScanComplete"],
          lines: [
            {
              text: "Necesitas registrar 'scan perimeter' antes de desplegar el watchdog.",
              type: "error",
            },
          ],
        },
      ],
      objective: "watchdogDeployed",
      alreadyDone: "El watchdog ya monitorea el perímetro.",
      lines: [
        "Desplegando watchdog del SOC...",
        { text: "Watchdog operativo, token archivado.", type: "success" },
      ],
    },
    {
      command: "enable port",
      label: "Puerto 4",
      knowledge: "knowsSwitchFix",
      unknown: [
        {
          text: "Necesitas revisar switch.conf antes de tocar el puerto.",
          type: "error",
        },
      ],
      after: [
        {
          progress: ["switchAuditComplete"],
          lines: [
            {
              text: "Intentaste habilitar un puerto crítico sin completar la auditoría previa.",
              type: "error",
            },
            {
              text: "La acción fue marcada como sabotaje operativo.",
              type: "hint",
            },
          ],
          failure: {
            reason:
              "Intentaste ejecutar 'enable port' sin realizar antes 'audit switch'.",
            strike: true,
            effect: "screen-obscure",
          },
        },
      ],
      objective: "switchPortEnabled",
      alreadyDone: "El puerto 4 ya está habilitado.",
      lines: [
        "Rehabilitando puerto 4 de la VLAN crítica...",
        { text: "Puerto 4 operativo, enlace restablecido.", type: "success" },
      ],
    },
    {
      command: "file report",
      label: "Informe",
      knowledge: "knowsIncidentReport",
      unknown: [
        { text: "No tienes el formato del informe.", type: "error" },
        {
          text: "Abre incident-template.txt o chain-of-custody.txt.",
          type: "hint",
        },
      ],
      after: [
        {
          progress: [
            "servicesRestarted",
            "perimeterScanComplete",
            "watchdogDeployed",
            "switchPortEnabled",
          ],
          lines: [
            {
              text: "Necesitas reinicio, escaneo, watchdog y puerto habilitado antes de documentar el caso.",
              type: "error",
            },
          ],
        },
      ],
      objective: "incidentReportFiled",
      alreadyDone: "El informe ya fue enviado al SOC.",
      lines: [
        "Compilando cadena de custodia...",
        { text: "Informe HARD-003 archivado correctamente.", type: "success" },
      ],
    },
  ],

  destructive: {
    lines: [
      { text: "Comando destructivo detectado.", type: "error" },
      {
        text: "La infraestructura respondió con lockout inmediato por sabotaje operativo.",
        type: "error",
      },
    ],
    failure: {
      reason:
        "Ejecutaste un comando destructivo en un entorno crítico de alta sensibilidad.",
      lockout: true,
      effect: "screen-obscure",
    },
  },

  submit: {
    pending: [
      { text: "Quedan pendientes antes de cerrar el caso.", type: "error" },
      { text: "Consulta 'status' para verlos.", type: "hint" },
    ],
    done: [
      "Verificando infraestructura extendida...",
      { text: "Todos los componentes responden.", type: "success" },
      { text: "Incidente 003 contenido. Excelente trabajo.", type: "success" },
    ],
  },
};
