import type {
  CaseDefinition,
  CaseLine,
  CaseState,
  CommandExecutionResult,
  TerminalLine,
  TerminalLineType,
} from "@/features/game/types/game-engine";

const DESTRUCTIVE_COMMANDS = [
  "rm -rf /",
  "format disk",
  "shutdown firewall",
  "disable firewall",
  "drop database",
  "reboot core",
  "wipe logs",
];

export const COMMON_COMMANDS = [
  "help",
  "clear",
  "ls",
  "status",
  "submit",
] as const;

function line(text: string, type: TerminalLineType = "system"): TerminalLine {
  return {
    id: crypto.randomUUID(),
    type,
    text,
  };
}

function toLines(lines: CaseLine[]): TerminalLine[] {
  return lines.map((l) =>
    typeof l === "string" ? line(l) : line(l.text, l.type),
  );
}

/** Comandos del caso para autocompletar, en el orden en que aparecen en help. */
export function getCaseCommands(def: CaseDefinition): string[] {
  return [
    ...def.files.map((f) => `cat ${f.name}`),
    ...def.actions.map((a) => a.command),
  ];
}

export function runCaseCommand(
  def: CaseDefinition,
  rawInput: string,
  state: CaseState,
): CommandExecutionResult {
  const input = rawInput.trim().toLowerCase();

  if (!input) {
    return { lines: [] };
  }

  if (DESTRUCTIVE_COMMANDS.includes(input)) {
    return {
      lines: toLines(def.destructive.lines),
      failure: def.destructive.failure,
    };
  }

  switch (input) {
    case "help":
      return {
        lines: [
          line("Comandos disponibles:", "hint"),
          ...["help", "clear", "ls"].map((c) => line(`- ${c}`, "hint")),
          ...(def.helpListsFiles
            ? def.files.map((f) => line(`- cat ${f.name}`, "hint"))
            : []),
          ...["status", "submit"].map((c) => line(`- ${c}`, "hint")),
          line(def.helpNote, "hint"),
        ],
      };

    case "clear":
      return { lines: [] };

    case "ls":
      return {
        lines: [
          line("Archivos disponibles:"),
          ...def.files.map((f) => line(`- ${f.name}`)),
        ],
      };

    case "status":
      return {
        lines: [
          line(`=== ESTADO DEL CASO ${def.id} ===`, "hint"),
          ...def.actions.map((a) =>
            line(
              `${a.label}: ${state.progress[a.objective] ? "OK" : "PENDIENTE"}`,
            ),
          ),
          line(
            `Comandos descubiertos: ${
              def.actions
                .filter((a) => state.knowledge[a.knowledge])
                .map((a) => a.command)
                .join(", ") || "ninguno"
            }`,
          ),
        ],
      };

    case "submit":
      if (!def.actions.every((a) => state.progress[a.objective])) {
        return { lines: toLines(def.submit.pending) };
      }
      return { lines: toLines(def.submit.done), completed: true };
  }

  const file = def.files.find((f) => `cat ${f.name}` === input);
  if (file) {
    return {
      lines: toLines(file.lines),
      ...(file.teaches && {
        nextState: { knowledge: { [file.teaches]: true } },
      }),
    };
  }

  const action = def.actions.find((a) =>
    a.code ? input.startsWith(a.command) : input === a.command,
  );
  if (action) {
    if (!state.knowledge[action.knowledge]) {
      return {
        lines: action.unknown
          ? toLines(action.unknown)
          : [
              line(
                "No sabes cómo ejecutar ese comando aún. Busca más pistas.",
                "error",
              ),
            ],
      };
    }

    const gate = action.after?.find((g) =>
      g.progress.some((key) => !state.progress[key]),
    );
    if (gate) {
      return {
        lines: toLines(gate.lines),
        ...(gate.failure && { failure: gate.failure }),
      };
    }

    if (state.progress[action.objective]) {
      return { lines: [line(action.alreadyDone, "hint")] };
    }

    if (action.code) {
      const code = input.slice(action.command.length).trim();
      if (!code) {
        return { lines: toLines(action.code.missing) };
      }
      if (code !== action.code.value) {
        return {
          lines: toLines(action.code.wrong),
          failure: action.code.failure,
        };
      }
    }

    return {
      lines: toLines(action.lines),
      nextState: { progress: { [action.objective]: true } },
      completedObjectiveKey: action.objective,
    };
  }

  return {
    lines: [
      line(`Comando no reconocido: ${rawInput}`, "error"),
      line("Prueba con 'help' o busca más pistas en los archivos.", "hint"),
    ],
  };
}
