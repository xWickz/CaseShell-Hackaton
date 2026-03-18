import type { Difficulty } from "@/types/game";

export type DifficultyOption = {
  id: Difficulty;
  label: string;
  description: string;
};

export const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    label: "Easy",
    description: "Caso corto, ideal para empezar y entender la mecánica.",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Más pistas, más pasos y decisiones más cuidadosas.",
  },
  {
    id: "hard",
    label: "Hard",
    description: "Investigación más compleja con múltiples fallos y rutas.",
  },
];
