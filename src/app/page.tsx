import Image from "next/image";
import GlowButton from "@/components/game/ui/glowingButton";
import Navbar from "@/components/game/ui/navbar";
import { GitHub } from "@/components/game/ui/github";

export default function HomePage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-black px-10 lg:px-20 font-sans pb-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
          <div
            className="animate-fade-in flex flex-col lg:flex-row items-center justify-between w-full gap-10 h-[calc(100vh-5rem)] lg:h-[calc(100vh-80px)]"
            id="intro"
          >
            {" "}
            <section
              className="w-full flex flex-col items-start gap-6 lg:max-w-xl"
              aria-label="Introducción al juego"
            >
              <div className="flex items-center gap-2">
                <a
                  href="https://cubepath.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Hackatón de CubePath
                  </span>
                </a>
              </div>

              <h1 className="text-7xl text-white font-bold tracking-tight">
                Case<span className="text-red-600">Shell</span>
              </h1>
              <p className="text-lg text-slate-400 mt-2 mb-5 max-w-md text-justify">
                <strong className="text-slate-300">Investiga</strong> incidentes
                técnicos dentro de un entorno virtual, explora archivos, usa la{" "}
                <strong className="text-slate-300">terminal</strong> y resuelve
                el <strong className="text-slate-300">caso</strong> como si
                estuvieras dentro del sistema.
              </p>
              <GlowButton href="/game">Jugar</GlowButton>
            </section>
            <aside className="relative hidden shrink-0 lg:block rotate-1 w-full max-w-137.5">
              <Image
                src="/demo1.webp"
                alt="Captura de pantalla del juego"
                width={800}
                height={640}
                className="h-auto w-full rounded-2xl shadow-2xl border border-white/10"
                priority
              />
            </aside>
          </div>

          {/* 2. SECCIÓN ¿QUÉ ES? */}
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 border-t border-white/10 pt-20 timeline-view animate-slide-in-left animate-range-[entry_5%_contain_20%]">
            <section className="w-full lg:max-w-xl">
              <h2 className="text-3xl text-white font-semibold tracking-tight mb-6">
                ¿Qué es CaseShell?
              </h2>
              <p className="text-lg text-slate-400 mb-5 text-justify leading-relaxed">
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

          {/* 3. SECCIÓN MECÁNICAS (Simetría Total) */}
          <section className="border-t border-white/10 pt-20 max-w-7xl mx-auto w-full">
            {/* Título alineado a la derecha del contenedor general */}
            <h2 className="text-3xl text-white font-semibold tracking-tight mb-16 text-right">
              Mecánicas del juego
            </h2>

            {/* Contenedor con w-full y justify-between para empujar a los extremos */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-24">
              {/* IZQUIERDA: Bento Grid con ancho controlado */}
              <div className="w-full lg:w-125 xl:w-150 grid grid-cols-2 grid-rows-2 gap-4 h-112.5">
                {/* Imagen 1: Grande */}
                <div className="row-span-2 bg-gray-900/50 rounded-3xl border border-white/10 overflow-hidden relative group">
                  <Image
                    src="/demo3_escritorio.webp"
                    alt="Mecánica 1"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Imagen 2: Superior Derecha */}
                <div className="bg-gray-900/50 rounded-3xl border border-white/10 overflow-hidden relative group">
                  <Image
                    src="/demo3_consola.webp"
                    alt="Mecánica 2"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Imagen 3: Inferior Derecha */}
                <div className="bg-gray-900/50 rounded-3xl border border-white/10 overflow-hidden relative group">
                  <Image
                    src="/demo3_notas.webp"
                    alt="Mecánica 3"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>

              {/* DERECHA: Texto alineado al borde derecho */}
              <div className="flex flex-col items-end flex-1">
                <div className="grid grid-cols-1 gap-10 text-lg text-slate-400 max-w-xl text-right">
                  <div>
                    <strong className="text-slate-300 text-xl block mb-1">
                      Sistema Operativo
                    </strong>
                    Navega por un entorno de escritorio simulado, interactúa con
                    archivos y ventanas para descubrir pistas.
                  </div>
                  <div>
                    <strong className="text-slate-300 text-xl block mb-1">
                      Terminal Funcional
                    </strong>
                    Usa comandos reales para explorar el sistema, analizar
                    archivos y ejecutar programas que te ayudarán.
                  </div>
                  <div>
                    <strong className="text-slate-300 text-xl block mb-1">
                      Pistas y Red Herrings
                    </strong>
                    No todo lo que encuentres será útil. Aprende a distinguir
                    entre pistas valiosas y distracciones.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. dificultades */}
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 border-t border-white/10 pt-20 timeline-view animate-slide-in-left animate-range-[entry_5%_contain_20%]">
            <section className="w-full">
              <h2 className="text-3xl text-white font-semibold tracking-tight mb-6">
                Dificultades
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 text-center">
                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                    Fácil
                  </h3>
                  <p className="text-slate-400">
                    Pistas claras, pocos archivos y comandos básicos. Ideal para
                    principiantes y tener una noción básica del juego.
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 text-center">
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">
                    Intermedio
                  </h3>
                  <p className="text-slate-400">
                    Más archivos, pistas menos directas y comandos avanzados.
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 text-center">
                  <h3 className="text-xl font-semibold text-red-500 mb-2">
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
      <footer className="bg-zinc-950 border-t border-white/10 px-10 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between py-10 text-sm text-zinc-400 font-sans gap-8">
          {/* IZQUIERDA: Créditos */}
          <div className="flex-1 text-left">
            <p>
              Desarrollado por{" "}
              <a
                href="https://wickz.dev"
                className="font-bold text-zinc-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wickz
              </a>
            </p>
            <p className="text-xs text-zinc-500">© 2026</p>
          </div>

          {/* CENTRO: Volver */}
          <div className="flex-1 text-center">
            <a
              href="#intro"
              className="text-white text-md border rounded-full border-white/30 px-2 py-2 font-bold transition-colors"
            >
              Volver al inicio
            </a>
          </div>

          {/* DERECHA: GitHub */}
          <div className="flex-1 flex justify-end">
            <a
              href="https://github.com/xWickz/CaseShell-Hackaton"
              className="text-zinc-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
