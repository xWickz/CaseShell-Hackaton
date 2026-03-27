import Link from "next/link";
import { difficulties } from "@/data/mock/difficulties";
import Navbar from "@/components/landing/components/Navbar";
import Footer from "@/components/landing/components/Footer";
import PendingSessionBanner from "@/components/game/ui/PendingSessionBanner";

export default function GameSelectPage() {
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
          <div className="mb-16">
            <PendingSessionBanner />
          </div>
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
                      className={`text-[10px] uppercase tracking-widest font-bold mb-2 block opacity-90 ${styles.text}`}
                    >
                      {diff.threat}
                    </span>
                    <h3
                      className={`text-3xl font-bold mb-4 tracking-tight text-white`}
                    >
                      {diff.label}
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed mb-10">
                      {diff.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-left text-sm text-zinc-300">
                      <Metric label="Duración" value={diff.meta.duration} />
                      <Metric label="Archivos" value={`${diff.meta.files}+`} />
                      <Metric label="Enfoque" value={diff.meta.focus} full />
                    </div>
                  </div>

                  <Link
                    href={`/game/${diff.id}`}
                    className="mt-5 w-full text-center text-white text-sm border border-white/10 rounded-2xl py-4 px-6 font-bold hover:bg-white hover:text-black transition-all duration-200 uppercase "
                  >
                    Iniciar Investigación
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

type MetricProps = {
  label: string;
  value: string;
  full?: boolean;
};

function Metric({ label, value, full = false }: MetricProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-3 ${full ? "col-span-2" : ""}`}
    >
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/50">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
