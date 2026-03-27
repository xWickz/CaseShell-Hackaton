import Image from "next/image";
import { CanvasTxt } from "@/components/landing/CanvasText";
import { CyberGridBg } from "@/components/landing/cyberGrid";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section className="relative w-full border-t border-white/10 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <CyberGridBg />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl text-white font-bold tracking-tighter font-mono flex flex-wrap justify-center lg:justify-start items-center gap-2">
                ¿Qué es Case <CanvasTxt text="Shell" />?
              </h2>

              <p className="text-md md:text-md text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0 text-justify">
                CaseShell es un mini-juego de investigación donde se simulará un
                sistema operativo en el cual podrás interactuar con:{" "}
                <strong className="text-white border-b border-emerald-500/30">
                  carpetas, imágenes, documentos y una terminal de comandos
                </strong>
                . El objetivo es resolver el caso según las pistas que
                encuentres.
              </p>
            </div>
            <div className="relative group w-full max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-md border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
                <Image
                  src="/demo_gif_02.gif"
                  width={700}
                  height={550}
                  alt="Gameplay CaseShell"
                  unoptimized
                  loading="eager"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
