import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameCase, isPlayable } from "@/features/game/data/cases";
import Desktop from "@/features/game/ui/desktop/Desktop";

// Los casos de temporada se abren y cierran por fecha: no cachear para siempre.
export const revalidate = 3600;

type GameCasePageProps = {
  params: Promise<{
    caseId: string;
  }>;
};

async function resolveCase(params: GameCasePageProps["params"]) {
  const { caseId } = await params;
  const gameCase = getGameCase(caseId);
  if (!gameCase || !isPlayable(gameCase)) notFound();
  return gameCase;
}

export async function generateMetadata({
  params,
}: GameCasePageProps): Promise<Metadata> {
  const gameCase = await resolveCase(params);
  return { title: gameCase.briefing.title };
}

export default async function GameCasePage({ params }: GameCasePageProps) {
  const gameCase = await resolveCase(params);

  return <Desktop caseId={gameCase.id} season={gameCase.season?.theme} />;
}
