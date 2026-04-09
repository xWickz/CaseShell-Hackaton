"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { WobbleCard } from "@/components/game/ui/wobble-card";

export default function Mechanics() {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section
        ref={sectionRef}
        className="relative border-t border-white/10 bg-black overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-90"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg, 
                rgba(0, 255, 128, 0.15) 0px, 
                rgba(0, 255, 128, 0) 1px, 
                transparent 1px, 
                transparent 20px
              )
            `,
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="mb-12 md:mb-20 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl text-snow-white font-bold tracking-tighter font-mono flex flex-wrap justify-center lg:justify-start items-center">
              Mecánicas del juego
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <WobbleCard
              backgroundStyle="linear-gradient(135deg, #3d4a56 0%, #2c353d 25%, #0a0a0a 100%)"
              containerClassName="col-span-1 lg:col-span-2 h-full min-h-[500px] lg:min-h-[300px] border border-gray-500/30"
            >
              <div className="max-w-xs relative z-10">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-egg-shell">
                  Terminal Funcional
                </h2>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  La terminal será tu <strong>mejor amiga</strong>! Con ella,
                  podrás ejecutar comandos, ver archivos, y descubrir pistas
                  ocultas.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -right-2 lg:-right-[35%] -bottom-10 z-10"
              >
                <Image
                  src="/demo3_02.webp"
                  width={600}
                  height={600}
                  alt="Terminal UI"
                  className="object-contain rounded-2xl opacity-90"
                />
              </motion.div>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-zinc-900/50 border border-white/10">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-egg-shell">
                Pistas
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                A través de los juegos encontrarás pistas, herramientas y demás.
                Pero cuidado, hay pistas falsas o información irrelevante...
              </p>
            </WobbleCard>

            <WobbleCard
              backgroundStyle="linear-gradient(135deg, #1f0101 0%, #3d0505 30%, #0a0a0a 100%)"
              containerClassName="col-span-1 lg:col-span-3 min-h-[500px] lg:min-h-[400px] border border-red-900/30"
            >
              <div className="max-w-sm relative z-10">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-egg-shell">
                  Sistema Operativo
                </h2>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  El juego simula un sistema operativo, podrás encontrar en él
                  archivos, imágenes, documentos, un chat simulado que podrá
                  ayudarte si te complicas.{" "}
                  <strong>¿Eres capaz de resolver el caso?</strong>
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -right-5 md:-right-[5%] lg:right-1 -bottom-8 z-10"
              >
                <Image
                  src="/demo3_01.webp"
                  width={500}
                  height={500}
                  alt="OS Interface"
                  className="object-contain rounded-2xl opacity-90"
                />
              </motion.div>
            </WobbleCard>
          </div>
        </div>
      </section>
    </div>
  );
}
