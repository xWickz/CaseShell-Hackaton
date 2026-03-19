import Link from "next/link";
import { difficulties } from "@/data/mock/difficulties";
import Navbar from "@/components/game/ui/navbar";
import Footer from "@/components/game/ui/footer";

export default function GameSelectPage() {
  // Mapeo de estilos para que Tailwind los detecte siempre
  const difficultyStyles: Record<
    string,
    { text: string; border: string; bg: string }
  > = {
    easy: {
      text: "text-emerald-400",
      border: "hover:border-emerald-500/50",
      bg: "group-hover:bg-emerald-500/5",
    },
    medium: {
      text: "text-yellow-400",
      border: "hover:border-yellow-500/50",
      bg: "group-hover:bg-yellow-500/5",
    },
    hard: {
      text: "text-red-500",
      border: "hover:border-red-500/50",
      bg: "group-hover:bg-red-500/5",
    },
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-black px-10 lg:px-20 font-sans pb-20">
        <div className="max-w-7xl mx-auto flex flex-col pt-32">
          <section className="w-full flex flex-col items-center text-center gap-6 mb-20">
            <h1 className="text-6xl lg:text-7xl text-white font-bold tracking-tight">
              Elige tu <span className="text-red-600">caso</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              Selecciona el nivel de investigación. Cada caso presenta retos
              técnicos únicos en la terminal.
            </p>
          </section>

          {/* GRID FULL WIDTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {difficulties.map((diff) => {
              const styles = difficultyStyles[diff.id] || difficultyStyles.easy;

              return (
                <div
                  key={diff.id}
                  className={`group bg-zinc-900/40 rounded-3xl border border-white/10 p-10 flex flex-col justify-between transition-all duration-300 shadow-2xl ${styles.border} ${styles.bg}`}
                >
                  <div>
                    <span
                      className={`text-[10px] uppercase tracking-widest font-bold mb-2 block opacity-70 ${styles.text}`}
                    >
                      CASO
                    </span>
                    <h3
                      className={`text-3xl font-bold mb-4 tracking-tight ${styles.text}`}
                    >
                      {diff.label}
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed mb-10">
                      {diff.description}
                    </p>
                  </div>

                  <Link
                    href={`/game/${diff.id}`}
                    className="w-full text-center text-white text-sm border border-white/10 rounded-2xl py-4 px-6 font-bold hover:bg-white hover:text-black transition-all duration-200 uppercase "
                  >
                    Iniciar Investigación
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
