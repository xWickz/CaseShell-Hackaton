export default function SecondHero() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section className="relative w-full border-t border-white/10 bg-zinc-950 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl text-snow-white/90 font-semibold tracking-tighter flex flex-wrap justify-center lg:justify-start items-center gap-2">
                The Ultimate Terminal
                <span className="text-red-600">Puzzle</span>
              </h2>

              <p className="text-md md:text-lg text-zinc-300 leading-relaxed max-w-lg mx-auto lg:mx-0 text-justify font-semibold">
                CaseShell es un mini-juego de investigación donde se simulará un
                sistema operativo en el cual podrás interactuar con:{" "}
                <strong className="text-snow-white border-b border-emerald-500/30">
                  carpetas, imágenes, documentos y una terminal de comandos
                </strong>
                . El objetivo es resolver el caso según las pistas que
                encuentres.{" "}
                <span className="text-zinc-100">
                  Gracias a ustedes, hemos quedado de cuarto lugar.{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
