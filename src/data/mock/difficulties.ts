import type { Difficulty } from "@/types/game";

export type DifficultyOption = {
  id: Difficulty;
  label: string;
  description: string;
  threat: string;
  meta: {
    duration: string;
    files: string;
    focus: string;
  };
};

export const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    label: "Acceso No Autorizado",
    description:
      "Alguien ha estado accediendo al servidor de la empresa a horas extrañas. Los directivos sospechan de un ex-empleado disgustado. Tienes acceso parcial al sistema; rastrea el origen, encuentra las credenciales comprometidas y detén el acceso.",
    threat: "Incidente Nivel 1",
    meta: {
      duration: "5-8 min",
      files: "12",
      focus: "Conectividad & firewall",
    },
  },
  {
    id: "medium",
    label: "Fuga de Datos",
    description:
      "Datos confidenciales están siendo filtrados hacia IPs externas. El culpable ha intentado borrar sus huellas y ocultó la información en archivos encriptados. Necesitas navegar por la red, descifrar los archivos ocultos y encontrar el script malicioso...",
    threat: "Incidente Nivel 2",
    meta: {
      duration: "12-18 min",
      files: "20",
      focus: "DNS & servicios críticos",
    },
  },
  {
    id: "hard",
    label: "Colapso Crítico",
    description:
      "Un ataque de ransomware ha bloqueado el acceso a la unidad central. El atacante dejó trampas (pistas falsas y scripts engañosos). Debes analizar logs corruptos, entender permisos de sistema complejos y ejecutar la secuencia de comandos de contramedida exacta. Un error podría formatear los discos.",
    threat: "Incidente Nivel 3",
    meta: {
      duration: "20+ min",
      files: "28",
      focus: "Switching & perímetro",
    },
  },
];
