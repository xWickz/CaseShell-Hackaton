"use client";

import { Sparkles, MousePointer2, Keyboard, PanelsTopLeft } from "lucide-react";

type OnboardingOverlayProps = {
  onDismiss: () => void;
};

const tips = [
  {
    icon: MousePointer2,
    title: "Explora el escritorio",
    description:
      "Haz doble clic sobre archivos o carpetas para abrirlos. Puedes arrastrar las ventanas para reorganizarlas.",
  },
  {
    icon: Keyboard,
    title: "Domina la terminal",
    description:
      "Escribe 'help' para ver comandos, usa Ctrl + Alt + T para volver a abrir la terminal cuando quieras.",
  },
  {
    icon: PanelsTopLeft,
    title: "Administra ventanas",
    description:
      "La X cierra una ventana. Haz clic en la barra superior para traerla al frente.",
  },
  {
    icon: Sparkles,
    title: "Completa objetivos",
    description:
      "Busca pistas, ejecuta comandos y revisa la barra inferior para revisar tu progreso en tiempo real.",
  },
];

export default function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const headingId = "onboarding-heading";

  return (
    <div
      className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3 text-sky-300">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Primer vistazo
            </p>
            <h2 id={headingId} className="text-2xl font-semibold text-white">
              Consejos rápidos para investigar
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => (
            <article
              key={tip.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
            >
              <tip.icon className="mb-3 h-5 w-5 text-emerald-300" aria-hidden="true" />
              <p className="text-base font-semibold text-white">{tip.title}</p>
              <p className="mt-1 text-white/70">{tip.description}</p>
            </article>
          ))}
        </div>

        <button
          onClick={onDismiss}
          className="mt-6 w-full rounded-2xl bg-emerald-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Listo, entrar al escritorio
        </button>
      </div>
    </div>
  );
}
