"use server";

import { auth } from "@/auth";
import { getGameCase } from "@/features/game/data/cases";
import { prisma } from "@/server/db/prisma";

export type SubmitRankingResult = {
  status: "created" | "improved" | "slower";
  previousTime?: number;
  currentTime: number;
};

export async function submitRankingAction(
  // Id del caso. Se guarda en la columna `difficulty`: los 3 casos originales
  // usan "easy" | "medium" | "hard" como id, así que el ranking viejo sigue igual.
  difficulty: string,
  timeSeconds: number,
): Promise<SubmitRankingResult> {
  const minSecondsByDifficulty: Record<string, number> = {
    easy: 30, //30 segundos si, pausible
    medium: 60, // 1 minuto? bueno, a ver
    hard: 120, // 2 minutos si ya se sabe todo pero igual
  };
  const gameCase = getGameCase(difficulty);
  if (!gameCase) {
    throw new Error("Caso inválido");
  }

  if (!Number.isFinite(timeSeconds) || timeSeconds <= 0) {
    throw new Error("Tiempo inválido");
  }

  const minSeconds = minSecondsByDifficulty[gameCase.tier];
  if (timeSeconds < minSeconds) {
    throw new Error("Tiempo no válido para ranking");
  }

  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    throw new Error("No estás autenticado");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(session.user.id ? [{ id: session.user.id }] : []),
        ...(session.user.email ? [{ email: session.user.email }] : []),
      ],
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado en la BD");
  }

  const existing = await prisma.ranking.findFirst({
    where: {
      userId: user.id,
      difficulty,
    },
  });

  if (!existing) {
    await prisma.ranking.create({
      data: {
        userId: user.id,
        difficulty,
        timeElapsed: timeSeconds,
        score: timeSeconds,
      },
    });

    return { status: "created", currentTime: timeSeconds };
  }

  if (timeSeconds >= existing.timeElapsed) {
    return {
      status: "slower",
      currentTime: timeSeconds,
      previousTime: existing.timeElapsed,
    };
  }

  await prisma.ranking.update({
    where: { id: existing.id },
    data: {
      timeElapsed: timeSeconds,
      score: timeSeconds,
    },
  });

  return {
    status: "improved",
    previousTime: existing.timeElapsed,
    currentTime: timeSeconds,
  };
}

export async function getRankingsAction(difficulty: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  const rankings = await prisma.ranking.findMany({
    where: { difficulty },
    orderBy: { timeElapsed: "asc" },
    take: 50,
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return rankings;
}
