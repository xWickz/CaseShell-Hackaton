import type { GameCase } from "./index";

// Caso de temporada: 1 dic → 6 ene.
// Mecánicas: ransomware (detenerlo ANTES de restaurar), elegir el backup
// limpio (el más reciente está infectado) y un acróstico como PIN.

const caseFile = `INCIDENTE 24 - OPERACIÓN TRINEO

Situación:

Es 24 de diciembre, 21:40. El Taller Polar tiene que despachar el trineo a medianoche y la lista de entregas amaneció cifrada:

    lista-entregas.db  ->  lista-entregas.db.krampus

En la pantalla del taller apareció un mensaje: "Este año nadie recibe regalos. - K."

Objetivos:
- Detener lo que está cifrando los archivos.
- Recuperar la lista de entregas.
- Desbloquear el sistema de navegación del trineo.
- Despachar el trineo antes de medianoche.

Pistas:
- No restaures nada mientras siga cifrando.
- No todos los backups están limpios.
- Los elfos esconden contraseñas en canciones.`;

const ransomNote = `LEEME_KRAMPUS.txt

Ho, ho... no.

Cifré la lista. Cifré la ruta. Este año el trineo se queda en tierra.
Si quieres tus regalos, paga 24 BTC antes de medianoche.

No intentes nada raro. Sigo aquí.

   - K.`;

const processes = `PROCESOS - taller-polar-01  (21:41)

PID   USUARIO   CPU   PROCESO
88    root      1%    nav-trineo
142   elfo3     0%    hoja-de-calculo
2412  root      97%   krampus.exe   <-- escribe en /entregas/*.krampus
2413  root      2%    cascabel-svc

Nota del jefe de elfos:
Ese krampus.exe sigue cifrando todo lo que encuentra.
Hay que detenerlo antes de restaurar NADA, o cifrará el backup también.

Comando: kill krampus`;

const backups = `BACKUPS - /backups/entregas/

ARCHIVO                         FECHA   ESTADO
lista-entregas_22-12.db         22-12   OK   (falta la ruta nueva de Oceanía)
lista-entregas_23-12.db         23-12   OK   (último backup completo)
lista-entregas_24-12.db         24-12   ??   creado 21:05 por root

Registro del antivirus:
[21:05] krampus.exe abrió lista-entregas_24-12.db en modo escritura

Comando: restore backup <fecha>   (ej: restore backup 22-12)`;

const elfNote = `nota-elfo.txt

¡Ya sé cómo arreglarlo! Restaura el backup de HOY (24-12),
que es el más nuevo y tiene todas las entregas.

   - Pimpo, elfo de guardia 🎄`;

const carol = `villancico-del-taller.txt

(El jefe de elfos dice que aquí escondió el PIN del trineo,
"en la primera letra de cada verso, como siempre".)

En lo alto del cielo brilla una luz,
Sobre el taller la nieve cae sin parar,
Todos los elfos cantan junto al fuego,
Renos impacientes esperan para volar.
Entre cascabeles se envuelve la ilusión,
Las cartas llegan de cada rincón,
La noche más larga ya va a empezar,
Abre la puerta, que el trineo va a despegar.

Comando: unlock sleigh <pin>`;

const dispatchManual = `MANUAL DE DESPACHO - Trineo T-1

Antes de despegar, el sistema verifica:
  1. Lista de entregas restaurada y legible.
  2. Navegación desbloqueada.

Si ambas están en verde:
  dispatch sleigh

Despegue programado: 00:00 del 25-12.`;

export const christmas001: GameCase = {
  id: "navidad",
  tier: "easy",
  code: "XMS-024-OPERACION-TRINEO",
  season: { theme: "christmas", from: "12-01", to: "01-06" },
  timeLimitMs: 20 * 60 * 1000,
  maxStrikes: 3,

  card: {
    label: "Operación Trineo",
    description:
      "Nochebuena, 21:40. Un ransomware llamado Krampus cifró la lista de entregas y bloqueó la navegación del trineo. Detenlo, recupera la lista del backup correcto y haz que el trineo despegue antes de medianoche.",
    threat: "Evento de Navidad",
    meta: {
      duration: "5-10 min",
      files: "7",
      focus: "Ransomware & backups",
    },
  },

  briefing: {
    title: "Operación Trineo",
    description:
      "Krampus cifró la lista de entregas del Taller Polar. Tienes hasta medianoche para recuperar la lista y despachar el trineo. Este año los regalos dependen de ti.",
    hints: [
      "Detén el ransomware antes de restaurar",
      "El backup más nuevo no siempre es el bueno",
      "Los elfos esconden contraseñas en canciones",
    ],
  },

  engine: {
    id: "XMS-024",
    helpNote: "Los elfos dejaron notas por todo el escritorio. Léelas.",
    helpListsFiles: true,
    files: [
      {
        name: "caso.txt",
        lines: [
          { text: "=== CASO: XMS-024 ===", type: "hint" },
          "La lista de entregas está cifrada y el trineo no puede despegar.",
          {
            text: "Pistas: procesos.txt, backups.txt, villancico-del-taller.txt",
            type: "hint",
          },
        ],
      },
      {
        name: "procesos.txt",
        teaches: "knowsKrampus",
        lines: [
          { text: "=== PROCESOS ===", type: "hint" },
          "PID 2412  krampus.exe  97% CPU  escribe *.krampus",
          "Detenlo antes de restaurar nada.",
          { text: "Has descubierto un comando: kill krampus", type: "success" },
        ],
      },
      {
        name: "backups.txt",
        teaches: "knowsBackups",
        lines: [
          { text: "=== BACKUPS ===", type: "hint" },
          "22-12  OK   (incompleto)",
          "23-12  OK   (último backup completo)",
          "24-12  ??   (krampus.exe lo abrió a las 21:05)",
          {
            text: "Has descubierto un comando: restore backup <fecha>",
            type: "success",
          },
        ],
      },
      {
        name: "nota-elfo.txt",
        lines: [
          { text: "=== NOTA DE PIMPO ===", type: "hint" },
          "Restaura el backup de HOY (24-12), que es el más nuevo.",
        ],
      },
      {
        name: "villancico-del-taller.txt",
        teaches: "knowsSleighPin",
        lines: [
          { text: "=== VILLANCICO DEL TALLER ===", type: "hint" },
          "En lo alto del cielo brilla una luz,",
          "Sobre el taller la nieve cae sin parar,",
          "Todos los elfos cantan junto al fuego,",
          "Renos impacientes esperan para volar.",
          "Entre cascabeles se envuelve la ilusión,",
          "Las cartas llegan de cada rincón,",
          "La noche más larga ya va a empezar,",
          "Abre la puerta, que el trineo va a despegar.",
          {
            text: "Has descubierto un comando: unlock sleigh <pin>",
            type: "success",
          },
        ],
      },
      {
        name: "manual-despacho.txt",
        teaches: "knowsDispatch",
        lines: [
          { text: "=== MANUAL DE DESPACHO ===", type: "hint" },
          "Requiere: lista restaurada + navegación desbloqueada.",
          {
            text: "Has descubierto un comando: dispatch sleigh",
            type: "success",
          },
        ],
      },
    ],
    actions: [
      {
        command: "kill krampus",
        label: "Krampus",
        knowledge: "knowsKrampus",
        unknown: [
          { text: "¿Matar qué? Revisa qué procesos corren.", type: "error" },
        ],
        objective: "krampusKilled",
        alreadyDone: "krampus.exe ya no corre.",
        lines: [
          "kill -9 2412 ...",
          {
            text: "krampus.exe detenido. Se acabó el cifrado.",
            type: "success",
          },
        ],
      },
      {
        command: "restore backup",
        label: "Lista de entregas",
        knowledge: "knowsBackups",
        unknown: [{ text: "No sabes dónde están los backups.", type: "error" }],
        after: [
          {
            progress: ["krampusKilled"],
            lines: [
              { text: "Restaurando...", type: "system" },
              {
                text: "krampus.exe cifró el backup en cuanto apareció en disco.",
                type: "error",
              },
              { text: "Detenlo antes de restaurar.", type: "hint" },
            ],
            failure: {
              reason:
                "Restauraste un backup mientras el ransomware seguía activo.",
              strike: true,
              effect: "scramble-labels",
            },
          },
        ],
        objective: "listRestored",
        alreadyDone: "La lista de entregas ya está restaurada.",
        code: {
          value: "23-12",
          missing: [{ text: "Uso: restore backup <fecha>", type: "error" }],
          wrong: [
            {
              text: "Ese backup no sirve: está incompleto o lo tocó krampus.exe.",
              type: "error",
            },
            {
              text: "Revisa el registro del antivirus en backups.txt.",
              type: "hint",
            },
          ],
          failure: {
            reason: "Restauraste un backup incompleto o infectado.",
            strike: true,
            effect: "scramble-labels",
          },
        },
        lines: [
          "cp lista-entregas_23-12.db lista-entregas.db",
          {
            text: "Lista restaurada: 2.143.908.211 entregas verificadas.",
            type: "success",
          },
        ],
      },
      {
        command: "unlock sleigh",
        label: "Navegación",
        knowledge: "knowsSleighPin",
        unknown: [
          { text: "La navegación pide un PIN que no conoces.", type: "error" },
        ],
        objective: "sleighUnlocked",
        alreadyDone: "La navegación ya está desbloqueada.",
        code: {
          value: "estrella",
          missing: [{ text: "Uso: unlock sleigh <pin>", type: "error" }],
          wrong: [
            {
              text: "PIN incorrecto. Los cascabeles suenan desafinados.",
              type: "error",
            },
            { text: "Lee la primera letra de cada verso.", type: "hint" },
          ],
          failure: {
            reason: "Ingresaste un PIN incorrecto en la navegación del trineo.",
            strike: true,
          },
        },
        lines: [
          "nav-trineo --unlock ...",
          {
            text: "Navegación desbloqueada. Ruta polar cargada.",
            type: "success",
          },
        ],
      },
      {
        command: "dispatch sleigh",
        label: "Despegue",
        knowledge: "knowsDispatch",
        unknown: [
          { text: "No conoces el procedimiento de despacho.", type: "error" },
        ],
        after: [
          {
            progress: ["listRestored", "sleighUnlocked"],
            lines: [
              {
                text: "Chequeo previo fallido: falta la lista o la navegación.",
                type: "error",
              },
              { text: "Revisa 'status'.", type: "hint" },
            ],
          },
        ],
        objective: "sleighDispatched",
        alreadyDone: "El trineo ya despegó.",
        lines: [
          "Chequeo previo: lista OK, navegación OK.",
          "3... 2... 1...",
          { text: "¡El trineo despegó a tiempo!", type: "success" },
        ],
      },
    ],
    destructive: {
      lines: [
        { text: "Comando bloqueado.", type: "error" },
        {
          text: "Un elfo te quita el teclado: 'en Nochebuena no se borra nada'.",
          type: "hint",
        },
      ],
      failure: {
        reason: "Intentaste un comando destructivo en el Taller Polar.",
        strike: true,
      },
    },
    submit: {
      pending: [
        { text: "El trineo aún no puede despegar.", type: "error" },
        { text: "Consulta 'status'.", type: "hint" },
      ],
      done: [
        "Enviando reporte al Taller Polar...",
        { text: "Entregas en curso. Krampus contenido.", type: "success" },
        { text: "¡Feliz Navidad, analista! 🎄", type: "success" },
      ],
    },
  },

  desktop: [
    { id: "terminal-main", name: "Terminal", type: "terminal" },
    {
      id: "ops-chat",
      name: "Taller Polar.chat",
      type: "chat",
      content: "Canal del jefe de elfos.",
    },
    { id: "xms-case", name: "caso.txt", type: "text", content: caseFile },
    {
      id: "xms-ransom",
      name: "LEEME_KRAMPUS.txt",
      type: "text",
      content: ransomNote,
    },
    { id: "xms-elf", name: "nota-elfo.txt", type: "text", content: elfNote },
    {
      id: "xms-system",
      name: "sistema",
      type: "folder",
      children: [
        {
          id: "xms-procs",
          name: "procesos.txt",
          type: "text",
          content: processes,
        },
        {
          id: "xms-backups",
          name: "backups.txt",
          type: "text",
          content: backups,
        },
      ],
    },
    {
      id: "xms-workshop",
      name: "taller",
      type: "folder",
      children: [
        {
          id: "xms-carol",
          name: "villancico-del-taller.txt",
          type: "text",
          content: carol,
        },
        {
          id: "xms-manual",
          name: "manual-despacho.txt",
          type: "text",
          content: dispatchManual,
        },
      ],
    },
  ],

  desktopHints: [
    {
      name: "procesos.txt",
      knowledge: "knowsKrampus",
      text: "krampus.exe sigue cifrando. Detenlo con 'kill krampus'.",
    },
    {
      name: "backups.txt",
      knowledge: "knowsBackups",
      text: "Hay tres backups. Restaura el limpio con 'restore backup <fecha>'.",
    },
    {
      name: "villancico-del-taller.txt",
      knowledge: "knowsSleighPin",
      text: "El villancico esconde el PIN: 'unlock sleigh <pin>'.",
    },
    {
      name: "manual-despacho.txt",
      knowledge: "knowsDispatch",
      text: "Con lista y navegación listas: 'dispatch sleigh'.",
    },
  ],

  tracker: [
    {
      title: "Contener",
      steps: [
        { key: "krampusKilled", label: "Detener a Krampus" },
        {
          key: "listRestored",
          label: "Restaurar la lista",
          dependsOn: ["krampusKilled"],
        },
      ],
    },
    {
      title: "Despegar",
      steps: [
        { key: "sleighUnlocked", label: "Desbloquear navegación" },
        {
          key: "sleighDispatched",
          label: "Despachar el trineo",
          dependsOn: ["listRestored", "sleighUnlocked"],
        },
      ],
    },
  ],

  chat: [
    {
      id: "intro",
      speaker: "ops",
      text: "Jefe de elfos// ¡Socorro! La lista está cifrada y el trineo sale a medianoche. ¡Eres nuestra única esperanza!",
      condition: { type: "always" },
    },
    {
      id: "mentor-1",
      speaker: "mentor",
      text: "Regla de oro con ransomware: primero detienes el proceso y después restauras. Al revés, cifra también el backup.",
      condition: { type: "always" },
      commandHint: "kill krampus",
    },
    {
      id: "krampus-done",
      speaker: "ops",
      text: "¡Dejó de cifrar! Pimpo dice que restauremos el backup de hoy... ¿seguro?",
      condition: { type: "progress", key: "krampusKilled" },
    },
    {
      id: "mentor-backup",
      speaker: "mentor",
      text: "El backup más nuevo no siempre es el bueno. Mira quién lo tocó por última vez.",
      condition: { type: "progress", key: "krampusKilled" },
      commandHint: "restore backup",
    },
    {
      id: "list-done",
      speaker: "ops",
      text: "¡Lista recuperada! Falta el PIN de navegación. El jefe siempre lo esconde en un villancico.",
      condition: { type: "progress", key: "listRestored" },
    },
    {
      id: "ready",
      speaker: "ops",
      text: "Lista y navegación en verde. ¡Despacha ese trineo!",
      condition: {
        type: "all",
        keys: ["listRestored", "sleighUnlocked"],
      },
      commandHint: "dispatch sleigh",
    },
    {
      id: "done",
      speaker: "mentor",
      text: "Buen trabajo. Y el próximo año: backups fuera de línea.",
      condition: { type: "progress", key: "sleighDispatched" },
      commandHint: "submit",
    },
  ],
};
