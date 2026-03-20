"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Target } from "lucide-react";
import { getRankingsAction } from "@/app/actions/ranking";

type Ranking = {
  id: string;
  difficulty: string;
  timeElapsed: number;
  user: {
    name: string | null;
    image: string | null;
  };
};

export default function RankingTable() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"easy" | "medium" | "hard">("easy");

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const data = await getRankingsAction(filter);
        setRankings(data as unknown as Ranking[]);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [filter]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }

  return (
    <>
      <div className="flex justify-center gap-4">
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setFilter(diff)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === diff
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {diff === "easy"
              ? "Fácil"
              : diff === "medium"
                ? "Medio"
                : "Díficil"}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center py-32 text-slate-500">
            Obteniendo logs de la base de datos...
          </div>
        ) : rankings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-2">
            <Target className="w-8 h-8 opacity-50" />
            <p>No hay registros para este nivel todavía. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6 font-medium">Rango</th>
                  <th className="py-4 px-6 font-medium">Nombre</th>
                  <th className="py-4 px-6 font-medium text-right">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rankings.map((run, index) => (
                  <tr
                    key={run.id}
                    className={`transition-colors hover:bg-white/5 ${
                      index < 3 ? "bg-emerald-500/5" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          index === 0
                            ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                            : index === 1
                              ? "bg-slate-300 text-black"
                              : index === 2
                                ? "bg-amber-700 text-white"
                                : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {run.user?.image ? (
                          <Image
                            src={run.user.image}
                            alt={run.user.name || "User"}
                            width={32}
                            height={32}
                            className="rounded-full bg-slate-800"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                            {(run.user?.name || "H").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-slate-200">
                          {run.user?.name || "Hacker Anónimo"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 font-mono text-emerald-400 font-medium">
                        <Clock className="w-4 h-4 opacity-70" />
                        {formatTime(run.timeElapsed)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
