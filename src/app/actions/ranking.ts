"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedDifficulties = new Set(["easy", "medium", "hard"]);

export type SubmitRankingResult = {
  status: "created" | "improved" | "slower";
  previousTime?: number;
  currentTime: number;
};

export async function submitRankingAction(
  difficulty: string,
  timeSeconds: number,
): Promise<SubmitRankingResult> {
  if (!allowedDifficulties.has(difficulty)) {
    throw new Error("Dificultad inválida");
  }

  if (!Number.isFinite(timeSeconds) || timeSeconds <= 0) {
    throw new Error("Tiempo inválido");
  }

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ id: session.user.id }, { email: session.user.email ?? "" }] },
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
