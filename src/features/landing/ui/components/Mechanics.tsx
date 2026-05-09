"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { WobbleCard } from "@/features/game/ui/ui/wobble-card";

export default function Mechanics() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section
        ref={sectionRef}
        className="relative border-t border-white/10 bg-zinc-950 overflow-hidden"
      >
        <div className="relative z-10 px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="mb-12 md:mb-20 text-center lg:text-left">
            <h2
              className="text-glitch select-none text-3xl md:text-5xl text-snow-white/90 font-semibold tracking-tighter flex flex-wrap justify-center lg:justify-start items-center"
              data-text="Mecánicas del juego"
            >
              Mecánicas del juego
            </h2>
          </div>

          <section className="text-zinc-300 w-full max-w-7xl mx-auto px-6 py-20 space-y-10">
            <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-20">
              <div className="w-full md:w-1/2">
                <Image
                  src="/demo3_02.webp"
                  width={600}
                  height={600}
                  alt="Terminal UI"
                  className="object-contain w-full h-auto border-3 border-white/10"
                />
              </div>

              <div className="w-full md:w-1/2 pt-2 space-y-6">
                <h2 className="font-bold text-3xl md:text-5xl tracking-tighter text-snow-white/90 leading-none">
                  Terminal funcional
                </h2>
                <p className="text-snow-white/90 font-bold text-sm md:text-lg max-w-md leading-relaxed">
                  La terminal será tu mejor amiga! Con ella, podrás ejecutar
                  comandos, ver archivos, y descubrir pistas ocultas.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-20">
              <div className="w-full md:w-1/2">
                <Image
                  src="/demo3_01.webp"
                  width={600}
                  height={600}
                  alt="Terminal UI"
                  className="object-contain w-full h-auto border-3 border-white/10"
                />
              </div>

              <div className="w-full md:w-1/2 pt-2 space-y-6">
                <h2 className="font-bold text-3xl md:text-5xl tracking-tighter text-snow-white/90 leading-none">
                  Sistema Operativo
                </h2>
                <p className="text-snow-white/90 font-bold text-sm md:text-lg max-w-md leading-relaxed">
                  El juego simula un sistema operativo, podrás encontrar en él
                  archivos, imágenes, documentos, un chat simulado que podrá
                  ayudarte si te complicas.{" "}
                  <strong>¿Eres capaz de resolver el caso?</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-20">
              <div className="w-full md:w-1/2">
                <Image
                  src="/demo3_notas.webp"
                  width={600}
                  height={600}
                  alt="Terminal UI"
                  className="object-contain w-full h-auto border-3 border-white/10"
                />
              </div>

              <div className="w-full md:w-1/2 pt-2 space-y-6">
                <h2 className="font-bold text-3xl md:text-5xl tracking-tighter text-snow-white/90 leading-none">
                  Pistas
                </h2>
                <p className="text-snow-white/90 font-bold text-sm md:text-lg max-w-md leading-relaxed">
                  A través de los juegos encontrarás pistas, herramientas y
                  demás. Pero cuidado, hay pistas falsas o información
                  irrelevante&hellip;
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
