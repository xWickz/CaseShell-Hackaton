import Link from "next/link";
import { difficulties } from "@/data/mock/difficulties";

export default function GameSelectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            Select Difficulty
          </p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Elige tu caso</h1>
          <p className="mt-3 text-slate-300">
            Comienza con un incidente sencillo y ve escalando en complejidad.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {difficulties.map((difficulty) => (
            <article
              key={difficulty.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm"
            >
              <h2 className="text-2xl font-semibold">{difficulty.label}</h2>
              <p className="mt-3 min-h-[72px] text-slate-300">
                {difficulty.description}
              </p>

              <Link
                href={`/game/${difficulty.id}`}
                className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Iniciar
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
