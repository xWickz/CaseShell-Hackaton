import type { Briefing, Difficulty } from "@/types/game";

export const briefingsByDifficulty: Record<Difficulty, Briefing> = {
  easy: {
    title: "Incidente 001",
    description:
      "La oficina no puede acceder a la aplicación interna. Investiga el escritorio, revisa archivos y encuentra la causa raíz del problema.",
    hints: [
      "Busca pistas en archivos de texto",
      "Revisa la carpeta config",
      "La terminal será importante más adelante",
    ],
  },
  medium: {
    title: "Incidente 002",
    description:
      "Hay múltiples fallos en la red interna. Reúne evidencia, revisa logs y corrige la configuración.",
    hints: [
      "Los logs contienen pistas importantes",
      "Puede haber conflictos entre red y firewall",
    ],
  },
  hard: {
    title: "Incidente 003",
    description:
      "La infraestructura presenta fallos encadenados. Analiza servicios, configuración de red y componentes internos.",
    hints: ["Habrá más de una causa", "No te quedes solo en una carpeta"],
  },
};
