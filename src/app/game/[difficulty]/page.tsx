import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Desktop from "@/components/game/desktop/Desktop";
import { briefingsByDifficulty } from "@/data/mock/mock-briefings";
import { mockDesktopItemsByDifficulty } from "@/data/mock/mock-filesystem";
import type { Difficulty } from "@/types/game";

type GameDifficultyPageProps = {
  params: Promise<{
    difficulty: string;
  }>;
};

export async function generateMetadata({
  params,
}: GameDifficultyPageProps): Promise<Metadata> {
  const { difficulty } = await params;
  const validDifficulties: Difficulty[] = ["easy", "medium", "hard"];
  if (!validDifficulties.includes(difficulty as Difficulty)) {
    notFound();
  }

  if (difficulty === "easy") {
    return {
      title: "Acceso Denegado",
    };
  } else if (difficulty === "medium") {
    return {
      title: "Fuga de Datos",
    };
  } else if (difficulty === "hard") {
    return {
      title: "Colapso Crítico",
    };
  }

  return {
    description: `¿Te sientes listo para jugar en ${difficulty}? Ven a descubrirlo en CaseShell. ¡Juega ahora!`,
  };
}

export default async function GameDifficultyPage({
  params,
}: GameDifficultyPageProps) {
  const { difficulty } = await params;

  const validDifficulties: Difficulty[] = ["easy", "medium", "hard"];

  if (!validDifficulties.includes(difficulty as Difficulty)) {
    notFound();
  }

  const difficultyKey = difficulty as Difficulty;

  const items = mockDesktopItemsByDifficulty[difficultyKey];
  const briefing = briefingsByDifficulty[difficultyKey];

  return (
    <Desktop items={items} briefing={briefing} difficulty={difficultyKey} />
  );
}
