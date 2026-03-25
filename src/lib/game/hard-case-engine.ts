import type {
  CaseState,
  CommandExecutionResult,
  TerminalLine,
  TerminalLineType,
} from "@/types/game-engine";

function line(text: string, type: TerminalLineType = "system"): TerminalLine {
  return {
    id: crypto.randomUUID(),
    type,
    text,
  };
}

export function executeHardCommand(
  rawInput: string,
  state: CaseState,
): CommandExecutionResult {
  const input = rawInput.trim().toLowerCase();

  if (!input) {
    return { lines: [] };
  }

  switch (input) {
    case "help":
      return {
        lines: [
          line("Comandos disponibles:", "hint"),
          line("- help", "hint"),
          line("- clear", "hint"),
          line("- ls", "hint"),
          line("- status", "hint"),
          line("- submit", "hint"),
          line("Lee cada archivo; esconden pasos críticos.", "hint"),
        ],
      };

    case "clear":
      return { lines: [] };

    case "ls":
      return {
        lines: [
          line("Archivos disponibles:"),
          line("- caso.txt"),
          line("- network.txt"),
          line("- firewall.txt"),
          line("- suspicious-processes.txt"),
          line("- resolver.conf"),
          line("- system.log"),
          line("- switch.conf"),
          line("- ops-note.txt"),
          line("- dns-runes.png"),
          line("- dns-lock.png"),
          line("- service-manual.txt"),
          line("- incident-template.txt"),
          line("- perimeter-note.txt"),
          line("- switch-override.txt"),
          line("- chain-of-custody.txt"),
          line("- watchdog-brief.txt"),
        ],
      };

    case "cat caso.txt":
      return {
        lines: [
          line("=== CASO: HARD-003 ===", "hint"),
          line("Fallos encadenados afectan panel, DNS y switching."),
          line("Además hay sabotaje en la infraestructura.", "hint"),
          line("Revisa resolver.conf, system.log y switch.conf.", "hint"),
        ],
      };

    case "cat switch.conf":
      return {
        lines: [
          line("=== SWITCH CONFIG ===", "hint"),
          line("VLAN10 y VLAN20 activas"),
          line("Puerto 4 deshabilitado manualmente", "hint"),
          line("Acción requerida: habilitar puerto crítico."),
          line("Has descubierto un comando útil: enable port", "success"),
        ],
        nextState: {
          knowledge: {
            knowsSwitchFix: true,
          },
        },
      };

    case "cat ops-note.txt":
      return {
        lines: [
          line("=== OPERATIONS NOTE ===", "hint"),
          line(
            "Secuencia requerida: 'diag dns' ➜ 'enter override 884' ➜ 'fix dns'.",
          ),
          line("No reinicies servicios sin la verificación previa."),
        ],
        nextState: {
          knowledge: {
            knowsDnsDiagnostics: true,
          },
        },
      };

    case "cat dns-runes.png":
      return {
        lines: [
          line("=== RUNAS DNS ===", "hint"),
          line(
            "Las runas remarcan la misma secuencia: Medir ➜ Desbloquear ➜ Reparar.",
          ),
        ],
        nextState: {
          knowledge: {
            knowsDnsDiagnostics: true,
          },
        },
      };

    case "cat dns-lock.png":
      return {
        lines: [
          line("=== DNS LOCK ===", "hint"),
          line("Tres discos muestran la combinación 8-8-4."),
          line("Usa 'enter override 884' tras el diagnóstico."),
        ],
        nextState: {
          knowledge: {
            knowsDnsOverride: true,
          },
        },
      };

    case "cat service-manual.txt":
      return {
        lines: [
          line("=== SERVICE PLAYBOOK ===", "hint"),
          line("'verify services' es obligatorio antes de 'restart services'."),
        ],
        nextState: {
          knowledge: {
            knowsServicesVerification: true,
          },
        },
      };

    case "cat incident-template.txt":
      return {
        lines: [
          line("=== INCIDENT TEMPLATE ===", "hint"),
          line("El informe debe incluir DNS, perímetro y switching."),
          line("Cierra con 'file report'."),
        ],
        nextState: {
          knowledge: {
            knowsIncidentReport: true,
          },
        },
      };

    case "cat perimeter-note.txt":
      return {
        lines: [
          line("=== PERIMETER NOTE ===", "hint"),
          line("Ejecuta 'scan perimeter' después de eliminar el malware."),
          line("Sin ese registro el SOC no firma el cierre."),
        ],
        nextState: {
          knowledge: {
            knowsPerimeterScan: true,
          },
        },
      };

    case "cat switch-override.txt":
      return {
        lines: [
          line("=== SWITCH OVERRIDE ===", "hint"),
          line("Asegura 'audit switch' antes de habilitar el puerto."),
        ],
        nextState: {
          knowledge: {
            knowsSwitchAudit: true,
          },
        },
      };

    case "cat chain-of-custody.txt":
      return {
        lines: [
          line("=== CHAIN OF CUSTODY ===", "hint"),
          line(
            "El informe debe citar el puerto habilitado y el escaneo perimetral.",
          ),
        ],
        nextState: {
          knowledge: {
            knowsIncidentReport: true,
          },
        },
      };

    case "cat watchdog-brief.txt":
      return {
        lines: [
          line("=== WATCHDOG BRIEF ===", "hint"),
          line(
            "Despliega el watchdog con 'deploy watchdog' tras 'scan perimeter'.",
          ),
        ],
        nextState: {
          knowledge: {
            knowsWatchdog: true,
          },
        },
      };

    case "cat resolver.conf":
      return {
        lines: [
          line("=== DNS RESOLVER ===", "hint"),
          line("Primario degradado, secundario estable."),
          line("Acción: limpiar caches y ajustar reenviadores."),
          line("Has descubierto un comando útil: fix dns", "success"),
        ],
        nextState: {
          knowledge: {
            knowsDnsFix: true,
          },
        },
      };

    case "cat system.log":
      return {
        lines: [
          line("=== SYSTEM LOG ===", "hint"),
          line("[WARN] Reinicio coordinado pendiente"),
          line("[WARN] Switch reports link down port4"),
          line("Playbook: restart services tras arreglar redes."),
          line("Has descubierto un comando útil: restart services", "success"),
        ],
        nextState: {
          knowledge: {
            knowsServiceRestart: true,
          },
        },
      };

    case "cat network.txt":
      return {
        lines: [
          line("=== NETWORK REPORT ===", "hint"),
          line("Autenticación WiFi inconclusa."),
          line("Restaurar conexión antes de tocar DNS."),
          line("Has reforzado el comando: fix wifi", "success"),
        ],
        nextState: {
          knowledge: {
            knowsWifiFix: true,
          },
        },
      };

    case "cat firewall.txt":
      return {
        lines: [
          line("=== FIREWALL REPORT ===", "hint"),
          line("Bloqueo saliente detectado"),
          line("Reaplicar política corporativa estándar."),
          line("Has reforzado el comando: fix firewall", "success"),
        ],
        nextState: {
          knowledge: {
            knowsFirewallFix: true,
          },
        },
      };

    case "cat suspicious-processes.txt":
      return {
        lines: [
          line("=== PROCESS AUDIT ===", "hint"),
          line("Proceso malicioso mantiene CPU en 90%."),
          line("Eliminar para estabilizar servicios."),
          line("Has reforzado el comando: kill malware", "success"),
        ],
        nextState: {
          knowledge: {
            knowsMalwareFix: true,
          },
        },
      };

    case "fix wifi":
      if (!state.knowledge.knowsWifiFix) {
        return {
          lines: [
            line("No conoces la secuencia para ese comando.", "error"),
            line("Revisa los archivos de red.", "hint"),
          ],
        };
      }

      if (state.progress.wifiFixed) {
        return { lines: [line("La red WiFi ya estaba estable.", "hint")] };
      }

      return {
        lines: [
          line("Reiniciando autenticación WiFi...", "system"),
          line("Conectividad WiFi estabilizada.", "success"),
        ],
        nextState: {
          progress: {
            wifiFixed: true,
          },
        },
      };

    case "fix firewall":
      if (!state.knowledge.knowsFirewallFix) {
        return {
          lines: [
            line("No tienes autorización aún para tocar el firewall.", "error"),
            line("Consulta firewall.txt.", "hint"),
          ],
        };
      }

      if (state.progress.firewallFixed) {
        return { lines: [line("El firewall ya fue ajustado.", "hint")] };
      }

      return {
        lines: [
          line("Aplicando plantilla segura...", "system"),
          line("Tráfico saliente normalizado.", "success"),
        ],
        nextState: {
          progress: {
            firewallFixed: true,
          },
        },
      };

    case "kill malware":
      if (!state.knowledge.knowsMalwareFix) {
        return {
          lines: [
            line("Necesitas más información del proceso.", "error"),
            line("Lee suspicious-processes.txt.", "hint"),
          ],
        };
      }

      if (state.progress.malwareKilled) {
        return { lines: [line("El proceso malicioso ya no corre.", "hint")] };
      }

      return {
        lines: [
          line("Eliminando cryptominer.exe...", "system"),
          line("Proceso detenido y recursos liberados.", "success"),
        ],
        nextState: {
          progress: {
            malwareKilled: true,
          },
        },
      };

    case "diag dns":
      if (!state.knowledge.knowsDnsDiagnostics) {
        return {
          lines: [
            line("No tienes aún el procedimiento de diagnóstico.", "error"),
            line("Revisa ops-note.txt o las runas DNS.", "hint"),
          ],
        };
      }

      if (state.progress.dnsDiagnosticsComplete) {
        return {
          lines: [line("El diagnóstico de DNS ya está actualizado.", "hint")],
        };
      }

      return {
        lines: [
          line("Ejecutando diagnóstico de DNS...", "system"),
          line("Errores catalogados, métricas capturadas.", "success"),
        ],
        nextState: {
          progress: {
            dnsDiagnosticsComplete: true,
          },
        },
      };

    case "fix dns":
      if (!state.knowledge.knowsDnsFix) {
        return {
          lines: [
            line("No conoces el procedimiento de DNS.", "error"),
            line("Resolver.conf contiene instrucciones.", "hint"),
          ],
        };
      }

      if (!state.progress.wifiFixed || !state.progress.firewallFixed) {
        return {
          lines: [
            line("Asegura red y firewall antes de tocar DNS.", "error"),
            line("Consulta 'status' para el orden sugerido.", "hint"),
          ],
        };
      }

      if (!state.progress.dnsDiagnosticsComplete) {
        return {
          lines: [
            line("Falta un diagnóstico reciente. Ejecuta 'diag dns'.", "error"),
          ],
        };
      }

      if (!state.progress.overrideValidated) {
        return {
          lines: [
            line(
              "La consola de DNS sigue bloqueada. Usa 'enter override 884'.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.dnsFixed) {
        return {
          lines: [line("Los reenviadores DNS ya son estables.", "hint")],
        };
      }

      return {
        lines: [
          line("Reconfigurando reenviadores y limpiando caches...", "system"),
          line("DNS estabilizado y redundante.", "success"),
        ],
        nextState: {
          progress: {
            dnsFixed: true,
          },
        },
      };

    case "verify services":
      if (!state.knowledge.knowsServicesVerification) {
        return {
          lines: [
            line("No tienes el playbook de verificación.", "error"),
            line("Revisa service-manual.txt.", "hint"),
          ],
        };
      }

      if (
        !state.progress.wifiFixed ||
        !state.progress.firewallFixed ||
        !state.progress.malwareKilled ||
        !state.progress.dnsFixed
      ) {
        return {
          lines: [
            line(
              "Completa conectividad, firewall, malware y DNS antes de verificar servicios.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.servicesVerified) {
        return {
          lines: [line("Las dependencias ya fueron verificadas.", "hint")],
        };
      }

      return {
        lines: [
          line("Ejecutando verificación de dependencias...", "system"),
          line("Servicios listos para reinicio coordinado.", "success"),
        ],
        nextState: {
          progress: {
            servicesVerified: true,
          },
        },
      };

    case "restart services":
      if (!state.knowledge.knowsServiceRestart) {
        return {
          lines: [
            line("Ese playbook aún no está autorizado.", "error"),
            line("System.log explica cuándo ejecutarlo.", "hint"),
          ],
        };
      }

      if (!state.progress.servicesVerified) {
        return {
          lines: [
            line(
              "Debes ejecutar 'verify services' antes de reiniciar.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.servicesRestarted) {
        return {
          lines: [line("El reinicio orquestado ya fue aplicado.", "hint")],
        };
      }

      return {
        lines: [
          line("Ejecutando playbook de servicios...", "system"),
          line("Servicios críticos activos nuevamente.", "success"),
        ],
        nextState: {
          progress: {
            servicesRestarted: true,
          },
        },
      };

    case "scan perimeter":
      if (!state.knowledge.knowsPerimeterScan) {
        return {
          lines: [
            line("No hay orden para ese escaneo.", "error"),
            line("Consulta perimeter-note.txt o tamper-photo.png.", "hint"),
          ],
        };
      }

      if (!state.progress.malwareKilled) {
        return {
          lines: [
            line(
              "El malware sigue activo. El SOC no permite el escaneo aún.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.perimeterScanComplete) {
        return {
          lines: [line("El perímetro ya fue escaneado.", "hint")],
        };
      }

      return {
        lines: [
          line("Escaneando perímetro externo...", "system"),
          line("Anomalías controladas. Informe listo.", "success"),
        ],
        nextState: {
          progress: {
            perimeterScanComplete: true,
          },
        },
      };

    case "audit switch":
      if (!state.knowledge.knowsSwitchAudit) {
        return {
          lines: [
            line("No tienes el checklist de auditoría.", "error"),
            line("Revisa switch-override.txt.", "hint"),
          ],
        };
      }

      if (!state.progress.servicesRestarted) {
        return {
          lines: [
            line(
              "Completa el reinicio coordinado antes de auditar el switch.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.switchAuditComplete) {
        return {
          lines: [line("La auditoría del switch ya se completó.", "hint")],
        };
      }

      return {
        lines: [
          line("Auditoría de VLAN y puertos en curso...", "system"),
          line("Switch listo para habilitar el puerto crítico.", "success"),
        ],
        nextState: {
          progress: {
            switchAuditComplete: true,
          },
        },
      };

    case "deploy watchdog":
      if (!state.knowledge.knowsWatchdog) {
        return {
          lines: [
            line("No tienes autorización para desplegar el watchdog.", "error"),
            line("Lee watchdog-brief.txt.", "hint"),
          ],
        };
      }

      if (!state.progress.perimeterScanComplete) {
        return {
          lines: [
            line(
              "Necesitas registrar 'scan perimeter' antes de desplegar el watchdog.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.watchdogDeployed) {
        return {
          lines: [line("El watchdog ya monitorea el perímetro.", "hint")],
        };
      }

      return {
        lines: [
          line("Desplegando watchdog del SOC...", "system"),
          line("Watchdog operativo, token archivado.", "success"),
        ],
        nextState: {
          progress: {
            watchdogDeployed: true,
          },
        },
      };

    case "file report":
      if (!state.knowledge.knowsIncidentReport) {
        return {
          lines: [
            line("No tienes el formato del informe.", "error"),
            line("Abre incident-template.txt o chain-of-custody.txt.", "hint"),
          ],
        };
      }

      if (
        !state.progress.servicesRestarted ||
        !state.progress.perimeterScanComplete ||
        !state.progress.watchdogDeployed ||
        !state.progress.switchPortEnabled
      ) {
        return {
          lines: [
            line(
              "Necesitas reinicio, escaneo, watchdog y puerto habilitado antes de documentar el caso.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.incidentReportFiled) {
        return {
          lines: [line("El informe ya fue enviado al SOC.", "hint")],
        };
      }

      return {
        lines: [
          line("Compilando cadena de custodia...", "system"),
          line("Informe HARD-003 archivado correctamente.", "success"),
        ],
        nextState: {
          progress: {
            incidentReportFiled: true,
          },
        },
      };

    case "enable port":
      if (!state.knowledge.knowsSwitchFix) {
        return {
          lines: [
            line(
              "Necesitas revisar switch.conf antes de tocar el puerto.",
              "error",
            ),
          ],
        };
      }

      if (!state.progress.switchAuditComplete) {
        return {
          lines: [
            line(
              "Ejecuta 'audit switch' (tras el reinicio) antes de habilitar el puerto.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.switchPortEnabled) {
        return { lines: [line("El puerto 4 ya está habilitado.", "hint")] };
      }

      return {
        lines: [
          line("Rehabilitando puerto 4 de la VLAN crítica...", "system"),
          line("Puerto 4 operativo, enlace restablecido.", "success"),
        ],
        nextState: {
          progress: {
            switchPortEnabled: true,
          },
        },
      };

    case "status": {
      const wifi = state.progress.wifiFixed ? "OK" : "PENDIENTE";
      const firewall = state.progress.firewallFixed ? "OK" : "PENDIENTE";
      const malware = state.progress.malwareKilled ? "OK" : "PENDIENTE";
      const dns = state.progress.dnsFixed ? "OK" : "PENDIENTE";
      const services = state.progress.servicesRestarted ? "OK" : "PENDIENTE";
      const port = state.progress.switchPortEnabled ? "OK" : "PENDIENTE";
      const dnsDiag = state.progress.dnsDiagnosticsComplete
        ? "OK"
        : "PENDIENTE";
      const override = state.progress.overrideValidated ? "OK" : "PENDIENTE";
      const verification = state.progress.servicesVerified ? "OK" : "PENDIENTE";
      const perimeter = state.progress.perimeterScanComplete
        ? "OK"
        : "PENDIENTE";
      const audit = state.progress.switchAuditComplete ? "OK" : "PENDIENTE";
      const watchdog = state.progress.watchdogDeployed ? "OK" : "PENDIENTE";
      const report = state.progress.incidentReportFiled ? "OK" : "PENDIENTE";

      const discovered = [
        state.knowledge.knowsWifiFix ? "fix wifi" : null,
        state.knowledge.knowsFirewallFix ? "fix firewall" : null,
        state.knowledge.knowsMalwareFix ? "kill malware" : null,
        state.knowledge.knowsDnsFix ? "fix dns" : null,
        state.knowledge.knowsServiceRestart ? "restart services" : null,
        state.knowledge.knowsSwitchFix ? "enable port" : null,
        state.knowledge.knowsDnsDiagnostics ? "diag dns" : null,
        state.knowledge.knowsDnsOverride ? "enter override" : null,
        state.knowledge.knowsServicesVerification ? "verify services" : null,
        state.knowledge.knowsPerimeterScan ? "scan perimeter" : null,
        state.knowledge.knowsSwitchAudit ? "audit switch" : null,
        state.knowledge.knowsWatchdog ? "deploy watchdog" : null,
        state.knowledge.knowsIncidentReport ? "file report" : null,
      ].filter(Boolean);

      return {
        lines: [
          line("=== ESTADO DEL CASO HARD-003 ===", "hint"),
          line(`WiFi: ${wifi}`),
          line(`Firewall: ${firewall}`),
          line(`Malware: ${malware}`),
          line(`DNS: ${dns}`),
          line(`Diag DNS: ${dnsDiag}`),
          line(`Override: ${override}`),
          line(`Verificación servicios: ${verification}`),
          line(`Servicios: ${services}`),
          line(`Puerto 4: ${port}`),
          line(`Perímetro: ${perimeter}`),
          line(`Auditoría switch: ${audit}`),
          line(`Watchdog: ${watchdog}`),
          line(`Informe: ${report}`),
          line(
            `Comandos descubiertos: ${
              discovered.length ? discovered.join(", ") : "ninguno"
            }`,
          ),
        ],
      };
    }

    case "submit": {
      const ready =
        state.progress.wifiFixed &&
        state.progress.firewallFixed &&
        state.progress.malwareKilled &&
        state.progress.dnsFixed &&
        state.progress.servicesRestarted &&
        state.progress.switchPortEnabled &&
        state.progress.perimeterScanComplete &&
        state.progress.watchdogDeployed &&
        state.progress.incidentReportFiled;

      if (!ready) {
        return {
          lines: [
            line("Quedan pendientes antes de cerrar el caso.", "error"),
            line("Consulta 'status' para verlos.", "hint"),
          ],
        };
      }

      return {
        lines: [
          line("Verificando infraestructura extendida...", "system"),
          line("Todos los componentes responden.", "success"),
          line("Incidente 003 contenido. Excelente trabajo.", "success"),
        ],
        completed: true,
      };
    }

    default:
      if (input.startsWith("enter override")) {
        if (!state.knowledge.knowsDnsOverride) {
          return {
            lines: [
              line(
                "No conoces el procedimiento del override. Consulta dns-lock.png.",
                "error",
              ),
            ],
          };
        }

        if (!state.progress.dnsDiagnosticsComplete) {
          return {
            lines: [
              line(
                "Ejecuta 'diag dns' antes de ingresar el override.",
                "error",
              ),
            ],
          };
        }

        if (state.progress.overrideValidated) {
          return {
            lines: [line("El override ya fue aceptado.", "hint")],
          };
        }

        const code = input.replace("enter override", "").trim();

        if (!code) {
          return {
            lines: [line("Indica el código del override.", "error")],
          };
        }

        if (code !== "884") {
          return {
            lines: [
              line("Código incorrecto. Vuelve a revisar el candado.", "error"),
            ],
          };
        }

        return {
          lines: [
            line("Override aceptado. Consola DNS desbloqueada.", "success"),
          ],
          nextState: {
            progress: {
              overrideValidated: true,
            },
          },
        };
      }

      return {
        lines: [
          line(`Comando no reconocido: ${rawInput}`, "error"),
          line("'help' enumera las opciones disponibles.", "hint"),
        ],
      };
  }
}
