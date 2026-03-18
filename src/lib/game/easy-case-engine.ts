import type {
  CommandExecutionResult,
  EasyCaseState,
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

export function executeEasyCommand(
  rawInput: string,
  state: EasyCaseState,
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
          line("- status", "hint"),
          line("- submit", "hint"),
          line(
            "Algunos comandos avanzados deben descubrirse leyendo pistas.",
            "hint",
          ),
        ],
      };

    case "clear":
      return {
        lines: [],
      };

    case "ls":
      return {
        lines: [
          line("Archivos disponibles:"),
          line("- caso.txt"),
          line("- network.txt"),
          line("- firewall.txt"),
          line("- suspicious-processes.txt"),
        ],
      };

    case "cat caso.txt":
      return {
        lines: [
          line("=== CASO: EASY-001 ===", "hint"),
          line("Un junior reporta que el panel interno no carga."),
          line("Debes revisar conectividad, firewall y procesos sospechosos."),
          line(
            "Pistas: revisa network.txt, firewall.txt y suspicious-processes.txt.",
          ),
        ],
      };

    case "cat network.txt":
      return {
        lines: [
          line("=== NETWORK REPORT ===", "hint"),
          line("SSID detectado, pero no hay autenticación completa."),
          line(
            "Nota del junior: 'creo que falta volver a levantar la conexión'.",
          ),
          line("Has descubierto un comando útil: fix wifi", "success"),
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
          line("Regla restrictiva bloqueando tráfico saliente del panel."),
          line("Nota interna: 'aplica la corrección estándar del firewall'."),
          line("Has descubierto un comando útil: fix firewall", "success"),
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
          line("Proceso sospechoso detectado: cryptominer.exe"),
          line("Consumo anómalo de recursos y conexiones externas activas."),
          line("Has descubierto un comando útil: kill malware", "success"),
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
            line(
              "No sabes cómo ejecutar ese comando aún. Busca más pistas.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.wifiFixed) {
        return {
          lines: [line("La conectividad WiFi ya estaba corregida.", "hint")],
        };
      }

      return {
        lines: [
          line("Reiniciando autenticación de red...", "system"),
          line("Conectividad WiFi restaurada correctamente.", "success"),
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
            line(
              "No sabes cómo ejecutar ese comando aún. Busca más pistas.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.firewallFixed) {
        return {
          lines: [line("El firewall ya estaba corregido.", "hint")],
        };
      }

      return {
        lines: [
          line("Aplicando política segura del firewall...", "system"),
          line(
            "Firewall corregido. El tráfico del panel ya no está bloqueado.",
            "success",
          ),
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
            line(
              "No sabes cómo ejecutar ese comando aún. Busca más pistas.",
              "error",
            ),
          ],
        };
      }

      if (state.progress.malwareKilled) {
        return {
          lines: [line("El proceso malicioso ya fue detenido.", "hint")],
        };
      }

      return {
        lines: [
          line("Finalizando proceso: cryptominer.exe...", "system"),
          line("Proceso malicioso detenido correctamente.", "success"),
        ],
        nextState: {
          progress: {
            malwareKilled: true,
          },
        },
      };

    case "status": {
      const wifi = state.progress.wifiFixed ? "OK" : "PENDIENTE";
      const firewall = state.progress.firewallFixed ? "OK" : "PENDIENTE";
      const malware = state.progress.malwareKilled ? "OK" : "PENDIENTE";

      const discovered = [
        state.knowledge.knowsWifiFix ? "fix wifi" : null,
        state.knowledge.knowsFirewallFix ? "fix firewall" : null,
        state.knowledge.knowsMalwareFix ? "kill malware" : null,
      ].filter(Boolean);

      return {
        lines: [
          line("=== ESTADO DEL CASO ===", "hint"),
          line(`WiFi: ${wifi}`),
          line(`Firewall: ${firewall}`),
          line(`Malware: ${malware}`),
          line(
            `Comandos descubiertos: ${
              discovered.length ? discovered.join(", ") : "ninguno"
            }`,
          ),
        ],
      };
    }

    case "submit": {
      const allFixed =
        state.progress.wifiFixed &&
        state.progress.firewallFixed &&
        state.progress.malwareKilled;

      if (!allFixed) {
        return {
          lines: [
            line(
              "Aún no puedes cerrar el caso. Revisa 'status' y completa lo pendiente.",
              "error",
            ),
          ],
        };
      }

      return {
        lines: [
          line("Validando estado final del sistema...", "system"),
          line("Todos los servicios están operativos.", "success"),
          line("¡Caso resuelto! Reporte enviado correctamente.", "success"),
        ],
        completed: true,
      };
    }

    default:
      return {
        lines: [
          line(`Comando no reconocido: ${rawInput}`, "error"),
          line("Prueba con 'help' o busca más pistas en los archivos.", "hint"),
        ],
      };
  }
}
