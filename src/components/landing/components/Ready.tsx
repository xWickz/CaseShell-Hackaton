import { FlipWords } from "@/components/game/ui/flip-words";
import GlowButton from "@/components/game/ui/glowingButton";

export default function Ready() {
  const words = ["descifrar", "analizar", "resolver"];

  return (
    <div className="max-w-7xl mx-auto w-full">
      <section className="relative w-full border-t border-white/10 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-red-700/5 to-red-900/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 px-6 md:px-10 lg:px-20 py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-6xl text-white font-bold tracking-tighter flex flex-wrap justify-center items-center gap-x-4 mb-12">
            <span>¿Listo para</span>
            <FlipWords words={words} />
            <span>el caso?</span>
          </h2>

          <GlowButton href="/game">Jugar ahora</GlowButton>
        </div>
      </section>
    </div>
  );
}
