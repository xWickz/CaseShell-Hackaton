// Registro de cambios que se muestra en /changelog.
// La entrada más reciente va primero. En los textos, `así` se ve como código.

export type ChangelogSection = {
  title: string;
  items: string[];
};

export type ChangelogEntry = {
  /** YYYY-MM-DD */
  date: string;
  version?: string;
  title: string;
  summary: string;
  /** Se destaca como gran actualización. */
  major?: boolean;
  sections: ChangelogSection[];
  /** Detalles para quien mira el código; van plegados. */
  technical?: ChangelogSection[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-11-11",
    version: "1.8.0",
    title: "Casos de temporada y partidas distintas",
    summary:
      "La primera gran actualización después de la hackatón: dos casos nuevos de temporada, códigos que cambian en cada partida y un motor nuevo que permite agregar casos mucho más rápido.",
    major: true,
    sections: [
      {
        title: "Nuevo caso: El Servidor 13",
        items: [
          "Disponible del 15 de octubre al 1 de diciembre. Nivel medio, 13 minutos.",
          "srv-13 lleva apagado desde 2009, pero anoche a las 03:13 empezó a enviar tráfico hacia afuera. Descubre qué lo trae de vuelta cada noche.",
          "Aprende cómo funcionan los procesos zombi: no se matan, se mata a su proceso padre.",
          "Quita la tarea programada que lo resucita, cierra el puerto que usa para hablar con el exterior y bloquea la cuenta de un admin dado de baja hace 17 años.",
          "Cuidado con las notas sin firma.",
        ],
      },
      {
        title: "Nuevo caso: Operación Trineo",
        items: [
          "Disponible del 1 de diciembre al 6 de enero. Nivel fácil, 20 minutos.",
          "Nochebuena, 21:40: el ransomware Krampus cifró la lista de entregas del Taller Polar y el trineo sale a medianoche.",
          "Aprende la regla de oro del ransomware: primero detenerlo, después restaurar.",
          "El backup más nuevo no siempre es el bueno, y el PIN del trineo está escondido en un villancico.",
        ],
      },
      {
        title: "Partidas distintas",
        items: [
          "El código del override en los casos Medio y Difícil ahora cambia en cada partida (hay 7 posibles), y la imagen del candado muestra el código correcto.",
          "En El Servidor 13 cambian el PID del proceso padre y el puerto que hay que cerrar.",
          "Reiniciar un caso genera códigos nuevos: ya no basta con memorizar la solución.",
        ],
      },
      {
        title: "Mejoras",
        items: [
          "Los eventos de temporada cambian el fondo del escritorio: noche con luna en Halloween y nieve en Navidad.",
          "La clasificación tiene una pestaña para cada caso, incluidos los eventos.",
          "El autocompletado de la terminal ya no revela el código del override.",
          "`status` muestra el código del caso que estás jugando.",
          "El aviso de partida pendiente muestra el nombre del caso.",
          "Nueva sección de Novedades (esta página).",
        ],
      },
    ],
    technical: [
      {
        title: "Un solo motor para todos los casos",
        items: [
          "Los tres motores escritos a mano (`easy/medium/hard-case-engine.ts`, unas 2.000 líneas de `switch`) se reemplazaron por `engine/case-runner.ts`, que lee la definición de cada caso como datos.",
          "Cada caso declara `files` (lo que muestra `cat` y qué comando enseña), `actions` (conocimiento requerido, prerrequisitos que pueden costar strike, código opcional) y las respuestas a `submit` y a comandos destructivos.",
          "`help`, `ls`, `status` y el autocompletado se generan a partir de esos datos.",
          "Antes de borrar los motores viejos se comprobó, recorriendo miles de estados de juego, que el nuevo responde exactamente igual.",
        ],
      },
      {
        title: "El caso es la unidad del juego",
        items: [
          "Todo lo que define un caso (motor, escritorio, chat, tracker, briefing, tiempo, strikes, temporada) vive en un `GameCase` dentro de `features/game/data/cases/`, registrado en `GAME_CASES`.",
          "La partida se identifica por `currentCaseId`, y `Difficulty` pasa a ser el nivel del caso. La ruta `/game/[difficulty]` ahora es `/game/[caseId]`.",
          "Los casos originales conservan los ids `easy`, `medium` y `hard`: las URLs, el ranking y las partidas guardadas siguen funcionando. Una migración del store renombra el campo en las partidas viejas.",
          "Agregar un caso nuevo es crear un archivo en `data/cases/` y sumarlo a `GAME_CASES`.",
        ],
      },
      {
        title: "Temporadas y variables",
        items: [
          "Un caso con `season: { from, to }` (formato `MM-DD`) solo aparece dentro de su ventana; fuera de ella `/game/<id>` responde 404. En desarrollo siempre está abierto.",
          "`/game` se revalida cada hora y `/game/[caseId]` se genera en cada visita, para que los eventos abran y cierren sin redeploy.",
          "Los textos pueden usar `{{nombre}}` declarado en `vars`. Cada partida tiene una semilla (`caseSeed`) que elige los valores, y `instantiateCase` los reemplaza.",
          "Las imágenes `dns-lock-<código>.webp` se generaron con `sharp` a partir de la original.",
        ],
      },
      {
        title: "Ranking y pruebas",
        items: [
          "El ranking acepta cualquier caso del registro, sin migrar la base de datos (sigue usando la columna `difficulty`). El tiempo mínimo depende del nivel.",
          "`cases.test.ts` valida cada caso con varias semillas: que se pueda resolver, que cada acción la enseñe algún archivo, que no queden variables sin resolver y que cada código tenga su imagen.",
          "Se eliminaron `terminal-commands.ts` y `checklist.ts`, que ya no se usaban.",
        ],
      },
    ],
  },
  {
    date: "2026-09-28",
    title: "Escritorio estilo Windows XP",
    summary:
      "El escritorio del juego ahora se ve como un sistema operativo clásico.",
    sections: [
      {
        title: "Cambios",
        items: [
          "Nuevo tema visual inspirado en Windows XP: fondo, íconos, ventanas, barra de tareas y pantalla de arranque.",
          "Mejoras en la página de inicio.",
        ],
      },
    ],
  },
  {
    date: "2026-05-09",
    title: "Nueva página de inicio",
    summary: "Rediseño de la landing y correcciones en la clasificación.",
    sections: [
      {
        title: "Cambios",
        items: [
          "Página de inicio rediseñada con fondo animado.",
          "Corregida la autenticación al enviar tu tiempo a la clasificación.",
          "El sitio ahora tiene `robots.txt` y `sitemap.xml`.",
        ],
      },
    ],
  },
  {
    date: "2026-04-09",
    title: "Pulido después de la hackatón",
    summary: "Correcciones y mejoras internas tras el evento.",
    sections: [
      {
        title: "Cambios",
        items: [
          "Corregido un exploit en el envío de tiempos a la clasificación.",
          "Cada página tiene ahora título y descripción propios al compartirla.",
          "El proyecto pasó de ESLint a Biome.",
        ],
      },
    ],
  },
  {
    date: "2026-04-08",
    version: "1.7.0",
    title: "4.º lugar en la hackatón",
    summary:
      "CaseShell quedó en 4.º lugar entre 200 proyectos en la hackatón de CubePath 2026. ¡Gracias por jugar!",
    sections: [
      {
        title: "La versión presentada",
        items: [
          "Tres casos: Acceso No Autorizado, Fuga de Datos y Colapso Crítico.",
          "Escritorio con ventanas, terminal funcional, chat de operaciones y panel de objetivos.",
          "Temporizador, sistema de strikes y alertas que interrumpen la partida.",
          "Clasificación global con inicio de sesión de GitHub.",
        ],
      },
    ],
  },
];
