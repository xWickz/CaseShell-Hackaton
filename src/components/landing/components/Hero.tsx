"use client";

import GlowButton from "@/components/game/ui/glowingButton";
import { CanvasTxt } from "@/components/landing/CanvasText";
import dynamic from "next/dynamic";
import Link from "next/link";

const MatrixRain = dynamic(
  () =>
    import("@/components/landing/MatrixRain").then((mod) => ({
      default: mod.MatrixRain,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/40 to-black" />
    ),
  },
);

const TerminalMockup = dynamic(
  () =>
    import("@/components/landing/TerminalMockup").then((mod) => ({
      default: mod.TerminalMockup,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-137.5 aspect-5/4 rounded-2xl border border-white/10 bg-black/40" />
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
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black pointer-events-none" />
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
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Hackatón de CubePath
              </span>
            </a>
          </div>

          <span className="flex items-center tracking-tighter">
            <h1 className="text-2xl font-bold md:text-4xl lg:text-6xl text-white">
              Case
            </h1>
            <CanvasTxt
              text="Shell"
              className="text-2xl font-bold md:text-4xl lg:text-6xl"
            />
          </span>

          <p className="text-base md:text-lg text-slate-400 max-w-md text-center lg:text-justify">
            <strong className="text-slate-300">Investiga</strong> incidentes
            técnicos dentro de un entorno virtual, explora archivos, usa la{" "}
            <strong className="text-slate-300">terminal</strong> y resuelve el{" "}
            <strong className="text-slate-300">caso</strong> como si estuvieras
            dentro del sistema.
          </p>
          <GlowButton href="/game">Jugar ahora</GlowButton>
        </section>

        <aside className="relative hidden shrink-0 lg:block w-full max-w-137.5 z-10">
          <TerminalMockup />
        </aside>
      </div>
    </div>
  );
}
