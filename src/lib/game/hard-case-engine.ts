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
          line("- cat caso.txt", "hint"),
          line("- cat network.txt", "hint"),
          line("- cat firewall.txt", "hint"),
          line("- cat suspicious-processes.txt", "hint"),
          line("- cat resolver.conf", "hint"),
          line("- cat system.log", "hint"),
          line("- cat switch.conf", "hint"),
          line("- fix wifi", "hint"),
          line("- fix firewall", "hint"),
          line("- kill malware", "hint"),
          line("- fix dns", "hint"),
          line("- restart services", "hint"),
          line("- enable port", "hint"),
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

      if (state.progress.dnsFixed) {
        return { lines: [line("Los reenviadores DNS ya son estables.", "hint")] };
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

    case "restart services":
      if (!state.knowledge.knowsServiceRestart) {
        return {
          lines: [
            line("Ese playbook aún no está autorizado.", "error"),
            line("System.log explica cuándo ejecutarlo.", "hint"),
          ],
        };
      }

      if (
        !state.progress.wifiFixed ||
        !state.progress.dnsFixed ||
        !state.progress.malwareKilled
      ) {
        return {
          lines: [
            line(
              "Asegura red, DNS y elimina malware antes de reiniciar servicios.",
              "error",
            ),
            line("Verifica el estado general.", "hint"),
          ],
        };
      }

      if (state.progress.servicesRestarted) {
        return { lines: [line("El reinicio orquestado ya fue aplicado.", "hint")] };
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

    case "enable port":
      if (!state.knowledge.knowsSwitchFix) {
        return {
          lines: [
            line("Necesitas revisar switch.conf antes de tocar el puerto.", "error"),
          ],
        };
      }

      if (!state.progress.servicesRestarted) {
        return {
          lines: [
            line(
              "Reinicia los servicios antes de reactivar el puerto crítico.",
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

      const discovered = [
        state.knowledge.knowsWifiFix ? "fix wifi" : null,
        state.knowledge.knowsFirewallFix ? "fix firewall" : null,
        state.knowledge.knowsMalwareFix ? "kill malware" : null,
        state.knowledge.knowsDnsFix ? "fix dns" : null,
        state.knowledge.knowsServiceRestart ? "restart services" : null,
        state.knowledge.knowsSwitchFix ? "enable port" : null,
      ].filter(Boolean);

      return {
        lines: [
          line("=== ESTADO DEL CASO HARD-003 ===", "hint"),
          line(`WiFi: ${wifi}`),
          line(`Firewall: ${firewall}`),
          line(`Malware: ${malware}`),
          line(`DNS: ${dns}`),
          line(`Servicios: ${services}`),
          line(`Puerto 4: ${port}`),
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
        state.progress.switchPortEnabled;

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
      return {
        lines: [
          line(`Comando no reconocido: ${rawInput}`, "error"),
          line("'help' enumera las opciones disponibles.", "hint"),
        ],
      };
  }
}
