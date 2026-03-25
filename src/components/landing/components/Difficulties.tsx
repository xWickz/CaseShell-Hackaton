import Link from "next/link";

// 1. Definición de los datos para que el map funcione
const difficulties = [
  {
    id: "easy",
    label: "Fácil",
    threat: "Nivel de Amenaza: Bajo",
    description:
      "Pistas claras, pocos archivos y comandos básicos. Ideal para principiantes y tener una noción básica del juego.",
    meta: { duration: "10-15 min", files: 5, focus: "Comandos básicos" },
  },
  {
    id: "medium",
    label: "Intermedio",
    threat: "Nivel de Amenaza: Moderado",
    description:
      "Más archivos, pistas menos directas y comandos avanzados. Requiere atención a los detalles.",
    meta: { duration: "20-30 min", files: 12, focus: "Lógica y Rastreo" },
  },
  {
    id: "hard",
    label: "Difícil",
    threat: "Nivel de Amenaza: Crítico",
    description:
      "Gran cantidad de archivos, pistas críticas y uso intensivo de la terminal. Sin comandos de ayuda.",
    meta: { duration: "45+ min", files: 20, focus: "Investigación Forense" },
  },
];

const difficultyStyles = {
  easy: {
    border: "hover:border-emerald-500/50",
    bg: "hover:bg-emerald-500/5",
    text: "text-emerald-400",
  },
  medium: {
    border: "hover:border-orange-500/50",
    bg: "hover:bg-orange-500/5",
    text: "text-orange-400",
  },
  hard: {
    border: "hover:border-red-500/50",
    bg: "hover:bg-red-500/5",
    text: "text-red-400",
  },
};

// Sub-componente para las métricas
const Metric = ({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) => (
  <div className={full ? "col-span-2 mt-2" : ""}>
    <p className="text-[10px] text-zinc-500 uppercase font-bold">{label}</p>
    <p className="text-zinc-200">{value}</p>
  </div>
);

export default function Difficulties() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section className="relative w-full border-t border-white/10 bg-black overflow-hidden">
        <div className="px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <h2 className="text-3xl md:text-5xl text-white font-bold tracking-tighter font-mono flex flex-wrap justify-center lg:justify-start items-center mb-16">
            Dificultades
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {difficulties.map((diff) => {
              const styles =
                difficultyStyles[diff.id as keyof typeof difficultyStyles] ||
                difficultyStyles.easy;

              return (
                <div
                  key={diff.id}
                  className={`group bg-zinc-900/40 rounded-3xl border border-white/10 p-8 flex flex-col justify-between transition-all duration-300 shadow-2xl ${styles.border} ${styles.bg}`}
                >
                  <div>
                    <span
                      className={`text-[10px] uppercase tracking-widest font-bold mb-2 block opacity-90 ${styles.text}`}
                    >
                      {diff.threat}
                    </span>
                    <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">
                      {diff.label}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                      {diff.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left text-sm text-zinc-300 border-t border-white/5 pt-6">
                      <Metric label="Duración" value={diff.meta.duration} />
                      <Metric label="Archivos" value={`${diff.meta.files}+`} />
                      <Metric label="Enfoque" value={diff.meta.focus} full />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
