import Image from "next/image";
import GlowButton from "@/components/game/ui/glowingButton";
import BorderButton from "@/components/game/ui/borderButton";
import Navbar from "@/components/game/ui/navbar";
import Footer from "@/components/game/ui/footer";

import { HeroTitle } from "@/components/landing/HeroTitle";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { TerminalMockup } from "@/components/landing/TerminalMockup";

export default function HomePage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-black px-6 md:px-10 lg:px-20 font-sans pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
          <div
            className="animate-fade-in flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full gap-10 min-h-[calc(100vh-5rem)] lg:min-h-0 lg:h-[calc(100vh-80px)] py-10 lg:py-0"
            id="intro"
          >
            <MatrixRain />
            <section
              className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:max-w-xl"
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

              <HeroTitle />
              <p className="text-base md:text-lg text-slate-400 mt-2 max-w-md text-center lg:text-justify">
                <strong className="text-slate-300">Investiga</strong> incidentes
                técnicos dentro de un entorno virtual, explora archivos, usa la{" "}
                <strong className="text-slate-300">terminal</strong> y resuelve
                el <strong className="text-slate-300">caso</strong> como si
                estuvieras dentro del sistema.
              </p>
              <BorderButton href="/game">Jugar Ahora</BorderButton>
            </section>

            <aside className="relative hidden shrink-0 lg:block w-full max-w-137.5 z-10">
              <TerminalMockup />
            </aside>
          </div>
          <section className="border-t border-white/10 pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-5 text-center lg:text-left">
                <p className="text-xs uppercase tracking-tight font-bold text-red-400/80">
                  Demo en vivo
                </p>
                <h2 className="text-3xl text-white font-semibold tracking-tight">
                  Mira el briefing, ejecuta comandos y envía el reporte en 90
                  segundos.
                </h2>
                <p className="text-base text-slate-400">
                  Este clip muestra el flujo real: briefing interactivo,
                  terminal con motor de casos y envío al ranking. Todo corre
                  dentro del entorno desplegado en CubePath.
                </p>
                <ul className="text-left text-slate-300 space-y-2 text-sm">
                  <li>• Briefing cinemático con checklist por dificultad</li>
                  <li>
                    • Terminal real con comandos personalizados (
                    <code>diag</code>, <code>fix</code>, <code>submit</code>)
                  </li>
                  <li>• Ranking y autosave sincronizados vía Server Actions</li>
                </ul>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <GlowButton href="/game">Entrar al Caso</GlowButton>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-tr from-red-500/20 via-transparent to-cyan-500/20" />
                <Image
                  src="https://i.imgur.com/7FUmfbx.gif"
                  width={500}
                  height={500}
                  alt="Gameplay del escritorio CaseShell"
                  loading="lazy"
                  className="relative w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 border-t border-white/10 pt-20 timeline-view animate-slide-in-left animate-range-[entry_5%_contain_20%]">
            <section className="w-full lg:max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-3xl text-white font-semibold tracking-tight mb-6">
                ¿Qué es CaseShell?
              </h2>
              <p className="text-base md:text-lg text-slate-400 mb-5 text-center lg:text-justify leading-relaxed">
                CaseShell es un mini-juego de investigación, dónde se simulará
                un sistema operativo en el cuál podrás interacturar con:{" "}
                <strong className="text-slate-300">
                  carpetas, imágenes, documentos y una terminal de comandos
                </strong>
                . El objetivo es resolver el caso según las pistas que
                encuentres y con la información que obtengas.
              </p>
            </section>

            <aside className="relative hidden shrink-0 lg:block -rotate-1 w-full max-w-112.5">
              <Image
                src="/demo2.webp"
                alt="Captura de pantalla del juego"
                width={800}
                height={640}
                className="h-auto w-full rounded-2xl shadow-2xl border border-white/10 opacity-90"
              />
            </aside>
          </div>
          <section className="border-t border-white/10 pt-20 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl text-white font-semibold tracking-tight mb-10 lg:mb-16 text-center lg:text-right">
              Mecánicas del juego
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-24">
              <div className="hidden lg:grid w-full lg:w-125 xl:w-150 grid-cols-2 grid-rows-2 gap-4 h-112.5">
                <div className="row-span-2 bg-gray-900/50 rounded-3xl border border-white/10 overflow-hidden relative group">
                  <Image
                    src="/demo3_escritorio.webp"
                    alt="Mecánica 1"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="bg-gray-900/50 rounded-3xl border border-white/10 overflow-hidden relative group">
                  <Image
                    src="/demo3_consola.webp"
                    alt="Mecánica 2"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="bg-gray-900/50 rounded-3xl border border-white/10 overflow-hidden relative group">
                  <Image
                    src="/demo3_notas.webp"
                    alt="Mecánica 3"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end flex-1 w-full">
                <div className="grid grid-cols-1 gap-10 text-base md:text-lg text-slate-400 max-w-xl text-center lg:text-right">
                  <div>
                    <strong className="text-slate-300 text-xl block mb-2 lg:mb-1">
                      Sistema Operativo
                    </strong>
                    Navega por un entorno de escritorio simulado, interactúa con
                    archivos y ventanas para descubrir pistas.
                  </div>
                  <div>
                    <strong className="text-slate-300 text-xl block mb-2 lg:mb-1">
                      Terminal Funcional
                    </strong>
                    Usa comandos reales para explorar el sistema, analizar
                    archivos y ejecutar programas que te ayudarán.
                  </div>
                  <div>
                    <strong className="text-slate-300 text-xl block mb-2 lg:mb-1">
                      Pistas y Red Herrings
                    </strong>
                    No todo lo que encuentres será útil. Aprende a distinguir
                    entre pistas valiosas y distracciones.
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="flex flex-col items-center lg:items-start w-full gap-10 border-t border-white/10 pt-20 timeline-view animate-slide-in-left animate-range-[entry_5%_contain_20%]">
            <section className="w-full">
              <h2 className="text-3xl text-white font-semibold tracking-tight mb-8 text-center lg:text-left">
                Dificultades
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                  <h3 className="text-2xl lg:text-xl font-semibold text-green-400 mb-3 lg:mb-2">
                    Fácil
                  </h3>
                  <p className="text-slate-400">
                    Pistas claras, pocos archivos y comandos básicos. Ideal para
                    principiantes y tener una noción básica del juego.
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                  <h3 className="text-2xl lg:text-xl font-semibold text-orange-400 mb-3 lg:mb-2">
                    Intermedio
                  </h3>
                  <p className="text-slate-400">
                    Más archivos, pistas menos directas y comandos avanzados.
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                  <h3 className="text-2xl lg:text-xl font-semibold text-red-500 mb-3 lg:mb-2">
                    Difícil
                  </h3>
                  <p className="text-slate-400">
                    Gran cantidad de archivos, pistas crípticas y uso intensivo
                    de la terminal.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
