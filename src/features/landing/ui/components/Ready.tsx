import Link from "next/link";
import { FlipWords } from "@/features/game/ui/ui/flip-words";

export default function Ready() {
  const words = ["descifrar", "analizar", "resolver"];

  return (
    <div className="max-w-7xl mx-auto w-full">
      <section className="relative w-full border-t border-white/10 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.14),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 px-6 md:px-10 lg:px-20 py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-6xl text-white font-semibold tracking-tighter flex flex-wrap justify-center items-center gap-x-3 mb-10">
            <span>¿Listo para</span>
            <FlipWords words={words} className="min-w-[4.6em] text-center" />
            <span>el caso?</span>
          </h2>

          <p className="md:hidden text-zinc-400 font-semibold">
            Disponible en ordenador
          </p>

          <Link
            href="/game"
            className="hidden md:inline-block bg-red-600 hover:bg-red-700 text-white text-lg md:text-lg font-semibold px-8 py-2 rounded-md transition-all active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)] font-sans border-2 border-red-500 hover:border-red-600"
          >
            Jugar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
