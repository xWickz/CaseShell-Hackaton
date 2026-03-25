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

export function executeMediumCommand(
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
          line(
            "Algunas acciones deben descubrirse investigando los archivos.",
            "hint",
          ),
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
          line("- ops-note.txt"),
          line("- dns-runes.png"),
          line("- dns-lock.png"),
          line("- service-manual.txt"),
          line("- incident-template.txt"),
        ],
      };
    case "cat ops-note.txt":
      return {
        lines: [
          line("=== OPERATIONS NOTE ===", "hint"),
          line("Los símbolos del rompecabezas DNS indican el orden correcto."),
          line("Primero ejecuta 'diag dns', luego 'fix dns'."),
          line("Has registrado el procedimiento de diagnóstico.", "success"),
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
          line("Triángulo ➜ Medir ➜ Reparar."),
          line("Traducción: ejecuta 'diag dns' antes de 'fix dns'."),
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
          line("Tres discos marcan la combinación 8-8-4."),
          line("Ingresa el override con 'enter override 884'."),
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
          line("No reinicies nada sin pasar por 'verify services'."),
          line("Cuando no haya alertas podrás usar 'restart services'."),
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
          line("=== INCIDENT REPORT TEMPLATE ===", "hint"),
          line("Debes documentar DNS, servicios y verificaciones."),
          line("Comando final: 'file report'."),
        ],
        nextState: {
          knowledge: {
            knowsIncidentReport: true,
          },
        },
      };

    case "cat caso.txt":
      return {
        lines: [
          line("=== CASO: MEDIUM-002 ===", "hint"),
          line("Incidencias encadenadas afectan la red interna."),
          line("Investiga conectividad, DNS y servicios críticos."),
          line("Pistas: revisa resolver.conf y system.log."),
        ],
      };

    case "cat network.txt":
      return {
        lines: [
          line("=== NETWORK REPORT ===", "hint"),
          line("Autenticación WiFi incompleta."),
          line("Nota: Reinicia la sesión de red para continuar."),
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
          line("Regla saliente bloqueando el panel interno."),
          line("Nota: aplica la corrección estándar."),
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
          line("cryptominer.exe consume recursos críticos."),
          line("Acción: finalizar proceso no autorizado."),
          line("Has reforzado el comando: kill malware", "success"),
        ],
        nextState: {
          knowledge: {
            knowsMalwareFix: true,
          },
        },
      };

    case "cat resolver.conf":
      return {
        lines: [
          line("=== DNS RESOLVER ===", "hint"),
          line("Primary: 10.0.0.53 (degraded)", "hint"),
          line("Secondary: 8.8.8.8 (ok)", "hint"),
          line("Acción sugerida: normalizar tablas DNS."),
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
          line("[WARN] Servicios esperando reinicio coordinado."),
          line("[INFO] Ejecutar playbook de reinicio supervisado."),
          line("Has descubierto un comando útil: restart services", "success"),
        ],
        nextState: {
          knowledge: {
            knowsServiceRestart: true,
          },
        },
      };

    case "fix wifi":
      if (!state.knowledge.knowsWifiFix) {
        return {
          lines: [
            line("No tienes aún la secuencia para ese comando.", "error"),
            line("Revisa los archivos de red para aprenderla.", "hint"),
          ],
        };
      }

      if (state.progress.wifiFixed) {
        return {
          lines: [line("La conectividad WiFi ya estaba estable.", "hint")],
        };
      }

      return {
        lines: [
          line("Reiniciando autenticación WiFi...", "system"),
          line("Conectividad restaurada correctamente.", "success"),
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
            line("Aún no sabes cómo aplicar esa regla.", "error"),
            line("Busca pistas en firewall.txt.", "hint"),
          ],
        };
      }

      if (state.progress.firewallFixed) {
        return {
          lines: [line("El firewall ya tenía la política correcta.", "hint")],
        };
      }

      return {
        lines: [
          line("Aplicando política segura...", "system"),
          line("Reglas normalizadas sin bloqueos críticos.", "success"),
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
            line("Ese proceso sigue sin identificar.", "error"),
            line("Lee suspicious-processes.txt para más datos.", "hint"),
          ],
        };
      }

      if (state.progress.malwareKilled) {
        return {
          lines: [line("El malware ya fue detenido.", "hint")],
        };
      }

      return {
        lines: [
          line("Finalizando cryptominer.exe...", "system"),
          line("Proceso finalizado y recursos liberados.", "success"),
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
          lines: [
            line("Ya cuentas con la lectura de DNS más reciente.", "hint"),
          ],
        };
      }

      return {
        lines: [
          line("Ejecutando diagnóstico de DNS...", "system"),
          line(
            "Reporte: latencia establecida, errores catalogados.",
            "success",
          ),
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
            line("No tienes el procedimiento para reparar DNS.", "error"),
            line("Resolver.conf contiene la pista.", "hint"),
          ],
        };
      }

      if (!state.progress.dnsDiagnosticsComplete) {
        return {
          lines: [
            line(
              "Aún no has corrido 'diag dns'. Necesitas datos frescos antes de reparar.",
              "error",
            ),
          ],
        };
      }

      if (!state.progress.overrideValidated) {
        return {
          lines: [
            line(
              "La consola sigue bloqueada. Ingresa el código del candado con 'enter override 884'.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.dnsFixed) {
        return {
          lines: [line("Las tablas DNS ya estaban estables.", "hint")],
        };
      }

      return {
        lines: [
          line("Normalizando caches y reenviadores...", "system"),
          line("DNS operativo con redundancia correcta.", "success"),
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
            line("Ese playbook no está disponible aún.", "error"),
            line("Los logs del sistema explican cómo usarlo.", "hint"),
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
            line("Sigue el playbook del SRE.", "hint"),
          ],
        };
      }

      if (state.progress.servicesRestarted) {
        return {
          lines: [line("El reinicio coordinado ya se ejecutó.", "hint")],
        };
      }

      return {
        lines: [
          line("Ejecutando playbook de servicios...", "system"),
          line("Servicios críticos reiniciados sin errores.", "success"),
        ],
        nextState: {
          progress: {
            servicesRestarted: true,
          },
        },
      };

    case "file report":
      if (!state.knowledge.knowsIncidentReport) {
        return {
          lines: [
            line("No tienes el formato del informe.", "error"),
            line("Abre incident-template.txt para ver los requisitos.", "hint"),
          ],
        };
      }

      if (!state.progress.servicesRestarted) {
        return {
          lines: [
            line("No puedes generar el informe sin reinicio exitoso.", "error"),
          ],
        };
      }

      if (state.progress.incidentReportFiled) {
        return {
          lines: [line("El informe ya fue enviado.", "hint")],
        };
      }

      return {
        lines: [
          line("Compilando hallazgos finales...", "system"),
          line("Informe MED-002 archivado correctamente.", "success"),
        ],
        nextState: {
          progress: {
            incidentReportFiled: true,
          },
        },
      };

    case "status": {
      const wifi = state.progress.wifiFixed ? "OK" : "PENDIENTE";
      const firewall = state.progress.firewallFixed ? "OK" : "PENDIENTE";
      const malware = state.progress.malwareKilled ? "OK" : "PENDIENTE";
      const dns = state.progress.dnsFixed ? "OK" : "PENDIENTE";
      const services = state.progress.servicesRestarted ? "OK" : "PENDIENTE";
      const dnsDiag = state.progress.dnsDiagnosticsComplete
        ? "OK"
        : "PENDIENTE";
      const override = state.progress.overrideValidated ? "OK" : "PENDIENTE";
      const verification = state.progress.servicesVerified ? "OK" : "PENDIENTE";
      const report = state.progress.incidentReportFiled ? "OK" : "PENDIENTE";

      const discovered = [
        state.knowledge.knowsWifiFix ? "fix wifi" : null,
        state.knowledge.knowsFirewallFix ? "fix firewall" : null,
        state.knowledge.knowsMalwareFix ? "kill malware" : null,
        state.knowledge.knowsDnsFix ? "fix dns" : null,
        state.knowledge.knowsServiceRestart ? "restart services" : null,
        state.knowledge.knowsDnsDiagnostics ? "diag dns" : null,
        state.knowledge.knowsDnsOverride ? "enter override" : null,
        state.knowledge.knowsServicesVerification ? "verify services" : null,
        state.knowledge.knowsIncidentReport ? "file report" : null,
      ].filter(Boolean);

      return {
        lines: [
          line("=== ESTADO DEL CASO MED-002 ===", "hint"),
          line(`WiFi: ${wifi}`),
          line(`Firewall: ${firewall}`),
          line(`Malware: ${malware}`),
          line(`DNS: ${dns}`),
          line(`Diag DNS: ${dnsDiag}`),
          line(`Override: ${override}`),
          line(`Verificación servicios: ${verification}`),
          line(`Servicios: ${services}`),
          line(`Informe final: ${report}`),
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
        state.progress.overrideValidated &&
        state.progress.servicesRestarted &&
        state.progress.incidentReportFiled;

      if (!ready) {
        return {
          lines: [
            line(
              "Aún hay tareas pendientes. Ejecuta 'status' para revisarlas.",
              "error",
            ),
          ],
        };
      }

      return {
        lines: [
          line("Validando servicios y monitoreo...", "system"),
          line("Todos los componentes responden correctamente.", "success"),
          line("Caso 002 resuelto. Buen trabajo.", "success"),
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
                "No conoces el procedimiento del override. Revisa el candado en dns-lock.png.",
                "error",
              ),
            ],
          };
        }

        if (!state.progress.dnsDiagnosticsComplete) {
          return {
            lines: [
              line(
                "Debes ejecutar 'diag dns' antes de ingresar el override.",
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
            lines: [line("Debes indicar el código del override.", "error")],
          };
        }

        if (code !== "884") {
          return {
            lines: [
              line(
                "Código incorrecto. Revisa dns-lock.png nuevamente.",
                "error",
              ),
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
          line("Recurre a 'help' o investiga más archivos.", "hint"),
        ],
      };
  }
}
