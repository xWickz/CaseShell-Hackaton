"use client";

import { WobbleCard } from "@/components/game/ui/wobble-card";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DitherMatrix = dynamic(
  () =>
    import("@/components/landing/ditherBg").then((mod) => ({
      default: mod.DitherMatrix,
    })),
  { ssr: false },
);

export default function Mechanics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showShader, setShowShader] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShowShader(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section
        ref={sectionRef}
        className="relative border-t border-white/10 bg-black overflow-hidden"
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40" aria-hidden="true">
          {showShader ? <DitherMatrix /> : null}
        </div>
        <div className="relative z-10 px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="mb-12 md:mb-20 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl text-white font-bold tracking-tighter font-mono flex flex-wrap justify-center lg:justify-start items-center">
              Mecánicas del juego
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-900 min-h-[500px] lg:min-h-[300px] border border-pink-500/20">
              <div className="max-w-xs relative z-10">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-white">
                  Terminal Funcional
                </h2>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  La terminal será tu <strong>mejor amiga</strong>! Con ella,
                  podrás ejecutar comandos, ver archivos, y descubrir pistas
                  ocultas.
                </p>
              </div>
              <Image
                src="/demo3_02.webp"
                width={600}
                height={600}
                alt="Terminal UI"
                className="absolute -right-2 lg:-right-[40%] -bottom-10 object-contain rounded-2xl opacity-80"
              />
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-zinc-900 border border-white/10">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-white">
                Pistas
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-300">
                A través de los juegos encontrarás pistas, herramientas y demás.
                Pero cuidado, hay pistas falsas o información irrelevante...
              </p>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[400px] border border-blue-500/20">
              <div className="max-w-sm relative z-10">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold text-white">
                  Sistema Operativo
                </h2>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  El juego simula un sistema operativo, podrás encontrar en él
                  archivos, imágenes, documentos, un chat simulado que podrá
                  ayudarte si te complicas. Pero recuerda, no todo es lo que
                  parece! <strong>¿Eres capaz de resolver el caso?</strong>
                </p>
              </div>
              <Image
                src="/demo3_01.webp"
                width={500}
                height={500}
                alt="OS Interface"
                className="absolute -right-5 md:-right-[10%] lg:right-5 -bottom-12 object-contain rounded-2xl opacity-80"
              />
            </WobbleCard>
          </div>
        </div>
      </section>
    </div>
  );
}
