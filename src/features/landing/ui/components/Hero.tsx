"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { CanvasTxt } from "@/features/landing/ui/CanvasText";

const MatrixRain = dynamic(
  () =>
    import("@/features/landing/ui/MatrixRain").then((mod) => ({
      default: mod.MatrixBackground,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-zinc-950/40 to-zinc-950" />
    ),
  },
);

const TerminalMockup = dynamic(
  () =>
    import("@/features/landing/ui/TerminalMockup").then((mod) => ({
      default: mod.TerminalMockup,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-137.5 aspect-5/4 rounded-2xl border border-white/10 bg-zinc-950/40" />
    ),
  },
);

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <div
        className="animate-fade-in flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full gap-10 min-h-[calc(100vh-5rem)] lg:min-h-0 lg:h-[calc(100vh-80px)] py-10 lg:py-0"
        id="intro"
      >
        <MatrixRain />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-zinc-950 pointer-events-none" />
        <section
          className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:max-w-xl z-11"
          aria-label="Introducción al juego"
        >
          <div className="flex items-center gap-2">
            <a
              href="https://cubepath.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-300/10 hover:border-emerald-600/20 hover:text-emerald-300 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Hackatón de CubePath
              </span>
            </a>
          </div>

          <span className="flex items-center tracking-tighter">
            <h1 className="text-7xl font-semibold md:text-4xl lg:text-6xl text-snow-white">
              Case
            </h1>
            <CanvasTxt
              text="Shell"
              className="text-7xl font-semibold md:text-4xl lg:text-6xl"
            />
          </span>

          <p className="text-base md:text-lg text-zinc-400 max-w-75 lg:max-w-md text-center lg:text-justify">
            <strong className="text-zinc-300">Investiga</strong> incidentes
            técnicos dentro de un entorno virtual, explora archivos, usa la{" "}
            <strong className="text-zinc-300">terminal</strong> y resuelve el{" "}
            <strong className="text-zinc-300">caso</strong> como si estuvieras
            dentro del sistema.
          </p>
          <Link
            href="/game"
            type="button"
            className="bg-scarlet-red hover:bg-scarlet-red/90 hover:scale-105 active:scale-95 transition text-snow-white text-md md:text-md font-bold px-8 py-2 rounded-md transition-all active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)] font-sans border-2 border-scarlet-red hover:border-scarlet-red/90"
          >
            Acceder al sistema
          </Link>
        </section>

        <aside className="relative hidden shrink-0 lg:block w-full max-w-137.5 z-10">
          <TerminalMockup />
        </aside>
      </div>
    </div>
  );
}
