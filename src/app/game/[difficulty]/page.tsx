import { notFound } from "next/navigation";
import Desktop from "@/components/game/desktop/Desktop";
import { mockDesktopItemsByDifficulty } from "@/data/mock/mock-filesystem";
import { briefingsByDifficulty } from "@/data/mock/mock-briefings";
import type { Difficulty } from "@/types/game";

type GameDifficultyPageProps = {
  params: Promise<{
    difficulty: string;
  }>;
};

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

  return <Desktop items={items} briefing={briefing} difficulty={difficultyKey} />;
}
