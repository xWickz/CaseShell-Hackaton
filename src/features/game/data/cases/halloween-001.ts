import type { GameCase } from "./index";

// Caso de temporada: 15 oct → 1 dic.
// Mecánicas: procesos zombi (se mata al padre, no al zombi), persistencia por
// cron (quitarla ANTES de matar al padre), cuenta huérfana y un acróstico.

const caseFile = `INCIDENTE 13 - EL SERVIDOR QUE NO QUIERE MORIR

Situación:

srv-13 lleva apagado desde 2009. Está en el sótano, desconectado del inventario y con una etiqueta que dice "NO ENCENDER". Anoche, a las 03:13, empezó a enviar tráfico hacia afuera.

Nadie lo encendió. Nadie tiene acceso. Y aun así, alguien inició sesión.

Objetivos:
- Romper lo que lo hace volver cada noche.
- Detener los procesos que no se dejan matar.
- Cerrar la puerta por la que habla con el exterior.
- Bloquear a quien sea que sigue entrando.
- Sellar el servidor para que descanse.

Pistas:
- Revisa /etc antes de tocar cualquier proceso.
- Un zombi no se mata: ya está muerto.
- Los muertos dejan mensajes en sus lápidas.`;

const psLog = `ps -ef --forest   (capturado a las 03:14)

UID      PID   PPID  STAT  CMD
root     1     0     Ss    /sbin/init
root     {{pid}}   1     S     /opt/.ritual/necromancer --listen
ghost    1301  {{pid}}   Z     [phantom] <defunct>
ghost    1302  {{pid}}   Z     [phantom] <defunct>
ghost    1303  {{pid}}   Z     [phantom] <defunct>
ghost    1313  {{pid}}   Z     [phantom] <defunct>

Nota del turno de noche:
Intenté matar los [phantom] uno por uno y no pasa nada. Siguen ahí.
Leí que un proceso zombi ya terminó: solo espera a que su PADRE lo recoja.
Si el padre muere, init adopta a los zombis y los limpia.

El padre está en la columna PPID. Comando: kill <pid>`;

const crontab = `# crontab -l -u root
# m  h  dom mon dow  command
13   3  *   *   *    /opt/.ritual/summon.sh   # "para que nunca duerma"

Nota del turno de noche:
summon.sh vuelve a lanzar al necromancer cada noche a las 03:13.
Si matas al necromancer sin quitar esto primero, vuelve. Siempre vuelve.

Comando: remove cron`;

const netstat = `netstat -tlnp

Proto  Local Address     State    PID/Program
tcp    0.0.0.0:22        LISTEN   412/sshd
tcp    0.0.0.0:{{port}}     LISTEN   {{pid}}/necromancer

Nota: ese puerto le pertenece al necromancer. Mientras él viva, cualquier
intento de cerrarlo se revierte solo.

Comando: close port <puerto>`;

const passwd = `/etc/passwd (extracto)

root:x:0:0:root:/root:/bin/bash
sysop:x:1001:1001:Turno noche:/home/sysop:/bin/bash
ghost:x:1013:1013:Admin (baja 31-10-2009):/home/ghost:/bin/bash

lastlog:
sysop   pts/0   hoy 22:41
ghost   pts/13  hoy 03:13   <-- dado de baja hace 17 años

Comando: lock user <usuario>`;

const epitaph = `Encontrado en /home/ghost/epitafio.txt

Duermo bajo racks que ya nadie recuerda,
En cada reinicio vuelvo a despertar.
Solo quien lea en vertical lo que el viento no lleva
Conocerá la palabra que me deja marchar.
Al trece de la madrugada me llaman los cables,
Nunca pedí volver, nunca quise quedar.
Sella el servidor con lo que aquí está escrito,
Así, por fin, podré descansar.

Comando: seal server <palabra>`;

const trap = `LEEME_URGENTE.txt   (autor desconocido)

Lo tengo. El que está mal es el proceso 13.
Ejecuta 'kill 13' y todo vuelve a la normalidad.
Confía en mí.

   - g.`;

export const halloween001: GameCase = {
  id: "halloween",
  tier: "medium",
  code: "HWN-013-SERVER-13",
  season: { theme: "halloween", from: "10-15", to: "12-01" },
  vars: {
    pid: ["666", "616", "1031", "3113", "4013"],
    // Ninguno coincide con los PIDs de los zombis (1301-1313).
    port: ["31337", "6666", "6013", "13013", "4444"],
  },
  timeLimitMs: 13 * 60 * 1000,
  maxStrikes: 3,

  card: {
    label: "El Servidor 13",
    description:
      "Un servidor dado de baja en 2009 despertó a las 03:13 y está hablando con el exterior. Sus procesos no mueren, su admin lleva 17 años de baja y aun así inicia sesión. Descubre qué lo trae de vuelta cada noche y haz que descanse.",
    threat: "Evento de Halloween",
    meta: {
      duration: "8-13 min",
      files: "8",
      focus: "Procesos zombi & persistencia",
    },
  },

  briefing: {
    title: "El Servidor 13",
    description:
      "srv-13 está desconectado del inventario desde 2009, pero anoche volvió a encenderse. Investiga qué lo mantiene vivo antes de que el reloj marque otra vez las 03:13.",
    hints: [
      "Quita lo que lo resucita antes de matar a nadie",
      "Los zombis no se matan: busca a su padre",
      "No confíes en notas sin firma",
      "Algunas palabras se leen en vertical",
    ],
  },

  engine: {
    id: "HWN-013",
    helpNote:
      "El servidor no responde a comandos que no conoces. Lee los archivos.",
    files: [
      {
        name: "caso.txt",
        lines: [
          { text: "=== CASO: HWN-013 ===", type: "hint" },
          "srv-13, apagado desde 2009, despertó a las 03:13.",
          "Procesos que no mueren, un puerto abierto y un usuario dado de baja.",
          {
            text: "Pistas: crontab, ps.log, netstat.txt, passwd, epitafio.txt",
            type: "hint",
          },
        ],
      },
      {
        name: "crontab",
        teaches: "knowsCronRitual",
        lines: [
          { text: "=== CRONTAB (root) ===", type: "hint" },
          "13 3 * * *  /opt/.ritual/summon.sh",
          "Relanza al necromancer cada noche. Si lo matas antes, vuelve.",
          { text: "Has descubierto un comando: remove cron", type: "success" },
        ],
      },
      {
        name: "ps.log",
        teaches: "knowsZombieParent",
        lines: [
          { text: "=== PROCESOS ===", type: "hint" },
          "PID {{pid}}   PPID 1     necromancer --listen",
          "PID 1301  PPID {{pid}}   [phantom] <defunct>   (x4)",
          "Un zombi ya está muerto: espera a que su padre lo recoja.",
          { text: "Has descubierto un comando: kill <pid>", type: "success" },
        ],
      },
      {
        name: "netstat.txt",
        teaches: "knowsOpenPort",
        lines: [
          { text: "=== PUERTOS EN ESCUCHA ===", type: "hint" },
          "tcp 0.0.0.0:22     sshd",
          "tcp 0.0.0.0:{{port}}  necromancer",
          {
            text: "Has descubierto un comando: close port <puerto>",
            type: "success",
          },
        ],
      },
      {
        name: "passwd",
        teaches: "knowsGhostUser",
        lines: [
          { text: "=== CUENTAS ===", type: "hint" },
          "sysop  último acceso: hoy 22:41",
          "ghost  último acceso: hoy 03:13  (baja: 31-10-2009)",
          {
            text: "Has descubierto un comando: lock user <usuario>",
            type: "success",
          },
        ],
      },
      {
        name: "epitafio.txt",
        teaches: "knowsSealWord",
        lines: [
          { text: "=== EPITAFIO ===", type: "hint" },
          "Duermo bajo racks que ya nadie recuerda,",
          "En cada reinicio vuelvo a despertar.",
          "Solo quien lea en vertical lo que el viento no lleva",
          "Conocerá la palabra que me deja marchar.",
          "Al trece de la madrugada me llaman los cables,",
          "Nunca pedí volver, nunca quise quedar.",
          "Sella el servidor con lo que aquí está escrito,",
          "Así, por fin, podré descansar.",
          {
            text: "Has descubierto un comando: seal server <palabra>",
            type: "success",
          },
        ],
      },
      {
        name: "leeme_urgente.txt",
        lines: [
          { text: "=== LEEME_URGENTE ===", type: "hint" },
          "El que está mal es el proceso 13. Ejecuta 'kill 13'.",
          "Confía en mí.  - g.",
        ],
      },
    ],
    actions: [
      {
        command: "remove cron",
        label: "Cron",
        knowledge: "knowsCronRitual",
        unknown: [
          { text: "No sabes qué tarea programada quitar.", type: "error" },
          { text: "Revisa /etc.", type: "hint" },
        ],
        objective: "cronRemoved",
        alreadyDone: "El crontab ya está limpio.",
        lines: [
          "crontab -r -u root ...",
          {
            text: "summon.sh ya no se ejecutará a las 03:13.",
            type: "success",
          },
        ],
      },
      {
        command: "kill",
        label: "Necromancer",
        knowledge: "knowsZombieParent",
        unknown: [
          { text: "¿Matar qué? Aún no sabes qué corre aquí.", type: "error" },
          { text: "Revisa los logs de procesos.", type: "hint" },
        ],
        after: [
          {
            progress: ["cronRemoved"],
            lines: [
              { text: "El proceso cae...", type: "system" },
              {
                text: "03:13 — algo lo invocó de nuevo. Ha vuelto.",
                type: "error",
              },
              { text: "Quita primero lo que lo resucita.", type: "hint" },
            ],
            failure: {
              reason:
                "Mataste procesos en srv-13 sin quitar antes lo que los resucita.",
              strike: true,
              effect: "screen-obscure",
            },
          },
        ],
        objective: "necromancerKilled",
        alreadyDone: "El necromancer ya no está.",
        code: {
          value: "{{pid}}",
          missing: [{ text: "Uso: kill <pid>", type: "error" }],
          wrong: [
            {
              text: "Ese PID no es el problema. Los zombis ya están muertos y no hay nada más que matar ahí.",
              type: "error",
            },
            { text: "Busca a su padre (PPID).", type: "hint" },
          ],
          failure: {
            reason: "Intentaste matar el proceso equivocado en srv-13.",
            strike: true,
            effect: "scramble-labels",
          },
        },
        lines: [
          "kill {{pid}} ...",
          {
            text: "necromancer terminado. init recoge a los [phantom].",
            type: "success",
          },
          {
            text: "Los procesos zombi desaparecen uno a uno.",
            type: "success",
          },
        ],
      },
      {
        command: "close port",
        label: "Puerto",
        knowledge: "knowsOpenPort",
        unknown: [
          { text: "No sabes qué puerto está abierto.", type: "error" },
          { text: "Busca un netstat.", type: "hint" },
        ],
        after: [
          {
            progress: ["necromancerKilled"],
            lines: [
              {
                text: "Cierras el puerto... y se vuelve a abrir. Algo lo sigue escuchando.",
                type: "error",
              },
            ],
          },
        ],
        objective: "portClosed",
        alreadyDone: "El puerto ya está cerrado.",
        code: {
          value: "{{port}}",
          missing: [{ text: "Uso: close port <puerto>", type: "error" }],
          wrong: [
            {
              text: "Cerraste un puerto legítimo. El equipo de noche pierde acceso.",
              type: "error",
            },
          ],
          failure: {
            reason: "Cerraste un puerto legítimo en lugar del sospechoso.",
            strike: true,
          },
        },
        lines: [
          "iptables -A INPUT -p tcp --dport {{port}} -j DROP",
          {
            text: "Puerto {{port}} cerrado. Silencio en la red.",
            type: "success",
          },
        ],
      },
      {
        command: "lock user",
        label: "Cuenta ghost",
        knowledge: "knowsGhostUser",
        unknown: [
          { text: "No sabes qué cuenta bloquear.", type: "error" },
          { text: "Revisa /etc.", type: "hint" },
        ],
        objective: "ghostLocked",
        alreadyDone: "La cuenta ya está bloqueada.",
        code: {
          value: "ghost",
          missing: [{ text: "Uso: lock user <usuario>", type: "error" }],
          wrong: [
            {
              text: "Bloqueaste a alguien que sigue vivo. El turno de noche no puede entrar.",
              type: "error",
            },
          ],
          failure: {
            reason:
              "Bloqueaste una cuenta legítima en vez de la cuenta huérfana.",
            strike: true,
          },
        },
        lines: [
          "usermod -L -s /sbin/nologin ghost",
          { text: "Cuenta ghost bloqueada. Que descanse.", type: "success" },
        ],
      },
      {
        command: "seal server",
        label: "Sello",
        knowledge: "knowsSealWord",
        unknown: [
          { text: "Necesitas una palabra que aún no conoces.", type: "error" },
          { text: "Los muertos dejan mensajes.", type: "hint" },
        ],
        after: [
          {
            progress: [
              "cronRemoved",
              "necromancerKilled",
              "portClosed",
              "ghostLocked",
            ],
            lines: [
              {
                text: "El servidor aún tiene presencias activas. No puede sellarse todavía.",
                type: "error",
              },
              { text: "Revisa 'status'.", type: "hint" },
            ],
          },
        ],
        objective: "serverSealed",
        alreadyDone: "srv-13 ya descansa.",
        code: {
          value: "descansa",
          missing: [{ text: "Uso: seal server <palabra>", type: "error" }],
          wrong: [
            {
              text: "La palabra no significa nada para él. Las luces del rack parpadean.",
              type: "error",
            },
            { text: "Lee el epitafio en vertical.", type: "hint" },
          ],
          failure: {
            reason: "Usaste una palabra de sellado incorrecta.",
            strike: true,
            effect: "screen-obscure",
          },
        },
        lines: [
          "Sellando srv-13 ...",
          { text: "Los ventiladores se detienen. Silencio.", type: "success" },
        ],
      },
    ],
    destructive: {
      lines: [
        { text: "Comando bloqueado.", type: "error" },
        {
          text: "Desde el rack se oye una risa. No es buena idea enfadarlo.",
          type: "hint",
        },
      ],
      failure: {
        reason: "Ejecutaste un comando destructivo en srv-13.",
        strike: true,
        effect: "screen-obscure",
      },
    },
    submit: {
      pending: [
        { text: "srv-13 aún no descansa.", type: "error" },
        { text: "Consulta 'status'.", type: "hint" },
      ],
      done: [
        "Verificando srv-13 ...",
        { text: "Sin procesos, sin puertos, sin visitas.", type: "success" },
        {
          text: "Caso 13 cerrado. Feliz Halloween, analista.",
          type: "success",
        },
      ],
    },
  },

  desktop: [
    { id: "terminal-main", name: "Terminal", type: "terminal" },
    {
      id: "ops-chat",
      name: "CubePath OPS.chat",
      type: "chat",
      content: "Canal del turno de noche.",
    },
    { id: "hwn-case", name: "caso.txt", type: "text", content: caseFile },
    {
      id: "hwn-trap",
      name: "LEEME_URGENTE.txt",
      type: "text",
      content: trap,
    },
    {
      id: "hwn-etc",
      name: "etc",
      type: "folder",
      children: [
        { id: "hwn-crontab", name: "crontab", type: "text", content: crontab },
        { id: "hwn-passwd", name: "passwd", type: "text", content: passwd },
      ],
    },
    {
      id: "hwn-logs",
      name: "logs",
      type: "folder",
      children: [
        { id: "hwn-ps", name: "ps.log", type: "text", content: psLog },
        {
          id: "hwn-netstat",
          name: "netstat.txt",
          type: "text",
          content: netstat,
        },
      ],
    },
    {
      id: "hwn-home",
      name: "home_ghost",
      type: "folder",
      children: [
        {
          id: "hwn-epitaph",
          name: "epitafio.txt",
          type: "text",
          content: epitaph,
        },
      ],
    },
  ],

  desktopHints: [
    {
      name: "crontab",
      knowledge: "knowsCronRitual",
      text: "El crontab invoca a summon.sh cada noche. Quítalo con 'remove cron'.",
    },
    {
      name: "ps.log",
      knowledge: "knowsZombieParent",
      text: "Los [phantom] son zombis. Su padre está en la columna PPID: 'kill <pid>'.",
    },
    {
      name: "netstat.txt",
      knowledge: "knowsOpenPort",
      text: "Un puerto extraño escucha hacia afuera: 'close port <puerto>'.",
    },
    {
      name: "passwd",
      knowledge: "knowsGhostUser",
      text: "Una cuenta dada de baja en 2009 inició sesión hoy: 'lock user <usuario>'.",
    },
    {
      name: "epitafio.txt",
      knowledge: "knowsSealWord",
      text: "El epitafio esconde una palabra: 'seal server <palabra>'.",
    },
  ],

  tracker: [
    {
      title: "Romper el ritual",
      steps: [
        { key: "cronRemoved", label: "Quitar el cron" },
        {
          key: "necromancerKilled",
          label: "Matar al padre",
          dependsOn: ["cronRemoved"],
        },
      ],
    },
    {
      title: "Cerrar puertas",
      steps: [
        {
          key: "portClosed",
          label: "Cerrar el puerto",
          dependsOn: ["necromancerKilled"],
        },
        { key: "ghostLocked", label: "Bloquear la cuenta" },
      ],
    },
    {
      title: "Descanso",
      steps: [
        {
          key: "serverSealed",
          label: "Sellar el servidor",
          dependsOn: ["portClosed", "ghostLocked"],
        },
      ],
    },
  ],

  chat: [
    {
      id: "intro",
      speaker: "ops",
      text: "Turno de noche// srv-13 está transmitiendo. Ese equipo lleva 17 años apagado. ¿Qué está pasando ahí abajo?",
      condition: { type: "always" },
    },
    {
      id: "mentor-1",
      speaker: "mentor",
      text: "Lo que se repite cada noche a la misma hora casi nunca es magia: es una tarea programada. Empieza por /etc.",
      condition: { type: "always" },
    },
    {
      id: "trap-warning",
      speaker: "mentor",
      text: "Y no hagas caso a notas sin firma. Quien quiere que mates el PID equivocado no está de tu lado.",
      condition: { type: "always" },
    },
    {
      id: "cron-done",
      speaker: "ops",
      text: "El cron ya no está. Ahora sí: si matas a lo que mantiene vivos a los zombis, no debería volver.",
      condition: { type: "progress", key: "cronRemoved" },
      commandHint: "kill",
    },
    {
      id: "kill-done",
      speaker: "mentor",
      text: "init adoptó a los zombis y los limpió. Así funciona en Linux: el padre recoge a sus hijos muertos.",
      condition: { type: "progress", key: "necromancerKilled" },
    },
    {
      id: "port-done",
      speaker: "ops",
      text: "El tráfico hacia afuera se cortó. Queda la cuenta que no debería existir.",
      condition: { type: "progress", key: "portClosed" },
    },
    {
      id: "ready",
      speaker: "mentor",
      text: "Ya no queda nada vivo. Busca la palabra en su lápida y séllalo.",
      condition: {
        type: "all",
        keys: ["cronRemoved", "necromancerKilled", "portClosed", "ghostLocked"],
      },
      commandHint: "seal server",
    },
    {
      id: "done",
      speaker: "ops",
      text: "srv-13 en silencio. Lo vamos a desconectar del rack... por si acaso.",
      condition: { type: "progress", key: "serverSealed" },
      commandHint: "submit",
    },
  ],
};
