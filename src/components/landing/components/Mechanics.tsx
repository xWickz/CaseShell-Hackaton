import Image from "next/image";
import { DitherMatrix } from "@/components/landing/ditherBg";
import { ColourfulText } from "@/components/landing/ColorfulText";

export default function Mechanics() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section className="relative w-full border-t border-white/10 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <DitherMatrix />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <h2 className="text-3xl text-white font-semibold tracking-tighter mb-5 lg:mb-6 text-center lg:text-right font-mono">
            <ColourfulText text="Mecanicas" /> del juego
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
        </div>
      </section>
    </div>
  );
}
