import type { Difficulty } from "@/types/game";

export type DifficultyOption = {
  id: Difficulty;
  label: string;
  description: string;
};

export const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    label: "Acceso No Autorizado",
    description:
      "Alguien ha estado accediendo al servidor de la empresa a horas extrañas. Los directivos sospechan de un ex-empleado disgustado. Tienes acceso parcial al sistema; rastrea el origen, encuentra las credenciales comprometidas y detén el acceso.",
  },
  {
    id: "medium",
    label: "Fuga de Datos",
    description:
      "Datos confidenciales están siendo filtrados hacia IPs externas. El culpable ha intentado borrar sus huellas y ocultó la información en archivos encriptados. Necesitas navegar por la red, descifrar los archivos ocultos y encontrar el script malicioso antes de que se robe toda la base de datos.",
  },
  {
    id: "hard",
    label: "Colapso Crítico",
    description:
      "Un ataque de ransomware ha bloqueado el acceso a la unidad central. El atacante dejó trampas (pistas falsas y scripts engañosos). Debes analizar logs corruptos, entender permisos de sistema complejos y ejecutar la secuencia de comandos de contramedida exacta. Un error podría formatear los discos.",
  },
];
