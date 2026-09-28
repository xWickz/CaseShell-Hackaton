import Image from "next/image";
import type { ReactNode } from "react";

const mechanics: {
  title: string;
  windowTitle: string;
  image: string;
  alt: string;
  text: ReactNode;
}[] = [
  {
    title: "Terminal funcional",
    windowTitle: "C:\\WINDOWS\\system32\\cmd.exe",
    image: "/demo3_02.webp",
    alt: "Terminal del juego",
    text: "¡La terminal será tu mejor amiga! Con ella, podrás ejecutar comandos, ver archivos, y descubrir pistas ocultas.",
  },
  {
    title: "Sistema Operativo",
    windowTitle: "Escritorio",
    image: "/demo3_01.webp",
    alt: "Escritorio del sistema operativo simulado",
    text: (
      <>
        El juego simula un escritorio al estilo Windows XP: archivos, imágenes,
        documentos y un chat que podrá ayudarte si te complicas.{" "}
        <strong>¿Eres capaz de resolver el caso?</strong>
      </>
    ),
  },
  {
    title: "Pistas",
    windowTitle: "notas.txt - Bloc de notas",
    image: "/demo3_notas.webp",
    alt: "Notas con pistas del caso",
    text: "A lo largo del juego encontrarás pistas, herramientas y demás. Pero cuidado, hay pistas falsas o información irrelevante…",
  },
];

export default function Mechanics() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section className="relative border-t border-white/10 bg-zinc-950 overflow-hidden">
        <div className="relative z-10 px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="mb-12 md:mb-20 text-center lg:text-left">
            <h2
              className="text-glitch select-none text-3xl md:text-5xl text-snow-white/90 font-semibold tracking-tighter flex flex-wrap justify-center lg:justify-start items-center"
              data-text="Mecánicas del juego"
            >
              Mecánicas del juego
            </h2>
          </div>

          <section className="text-zinc-300 w-full max-w-7xl mx-auto px-6 py-20 space-y-16">
            {mechanics.map((mechanic) => (
              <div
                key={mechanic.title}
                className="flex flex-col md:flex-row items-start gap-10 lg:gap-20"
              >
                <div className="os-window w-full md:w-1/2 overflow-hidden font-[Tahoma,Verdana,sans-serif]">
                  <div
                    className="os-titlebar flex items-center justify-between"
                    aria-hidden="true"
                  >
                    <span className="truncate text-white">
                      {mechanic.windowTitle}
                    </span>
                    <span className="os-titlebtn os-close text-xs">✕</span>
                  </div>
                  <Image
                    src={mechanic.image}
                    width={600}
                    height={600}
                    alt={mechanic.alt}
                    className="object-contain w-full h-auto"
                  />
                </div>

                <div className="w-full md:w-1/2 pt-2 space-y-6">
                  <h2 className="font-semibold text-3xl md:text-5xl tracking-tighter text-snow-white/90 leading-none">
                    {mechanic.title}
                  </h2>
                  <p className="text-snow-white/90 font-semibold text-sm md:text-lg max-w-md leading-relaxed">
                    {mechanic.text}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </section>
    </div>
  );
}
