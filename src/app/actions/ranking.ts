"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitRankingAction(difficulty: string, timeSeconds: number) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ id: session.user.id }, { email: session.user.email ?? "" }] }
  });

  if (!user) {
    throw new Error("Usuario no encontrado en la BD");
  }

  const newRanking = await prisma.ranking.create({
    data: {
      userId: user.id,
      difficulty,
      timeElapsed: timeSeconds,
      score: timeSeconds,
    }
  });
  
  return newRanking;
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
