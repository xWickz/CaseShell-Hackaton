import type { Briefing, Difficulty } from "@/types/game";

export const briefingsByDifficulty: Record<Difficulty, Briefing> = {
  easy: {
    title: "Acceso Denegado",
    description:
      "La oficina no puede acceder a la aplicación interna. Investiga el escritorio, revisa archivos y encuentra la causa raíz del problema.",
    hints: [
      "Busca pistas en archivos de texto",
      "Revisa la carpeta config",
      "La terminal será importante más adelante",
    ],
  },
  medium: {
    title: "Fuga de Datos",
    description:
      "Hay múltiples fallos en la red interna. Reúne evidencia, revisa logs y corrige la configuración.",
    hints: [
      "Los logs contienen pistas importantes",
      "Puede haber conflictos entre red y firewall",
      "Ya no tienes tanta información como antes",
      "La terminal solo muestra los comandos básicos, el resto debes descubrirlo tú mismo",
    ],
  },
  hard: {
    title: "Colapso Crítico",
    description:
      "La infraestructura presenta fallos encadenados. Analiza servicios, configuración de red y componentes internos. No se tiene mucha información sobre este caso, debes indagar por tus propios medios. Confiamos en ti, ¡por algo te contratamos! suerte, junior.",
    hints: [
      "Habrá más de una causa",
      "No te quedes solo en una carpeta",
      "Revisa los archivos de texto, imágenes, y la terminal. Todo puede contener pistas valiosas",
      "Algunos comandos deben ser colocados exactos o en orden",
    ],
  },
};
