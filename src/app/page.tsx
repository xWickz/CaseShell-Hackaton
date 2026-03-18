import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-md">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-400">
          Interactive VPS Investigation
        </p>

        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
          CaseShell
        </h1>

        <p className="mb-8 max-w-2xl text-base text-slate-300 md:text-lg">
          Investiga incidentes técnicos dentro de un entorno virtual, explora
          archivos, usa la terminal y resuelve el caso como si estuvieras dentro
          del sistema.
        </p>

        <Link
          href="/game"
          className="rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:scale-105 hover:bg-emerald-400"
        >
          Jugar
        </Link>
      </section>
    </main>
  );
}
