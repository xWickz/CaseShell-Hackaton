export default function SecondHero() {
  return (
    <div
      id="about"
      className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32 scroll-mt-12"
    >
      <section className="relative w-full border-t border-white/10 bg-zinc-950 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl text-snow-white/90 font-semibold tracking-tighter flex flex-wrap justify-center lg:justify-start items-center gap-2">
                El puzzle de terminal
                <span className="text-red-600">definitivo</span>
              </h2>

              <p className="text-md md:text-lg text-zinc-300 leading-relaxed max-w-lg mx-auto lg:mx-0 text-justify font-semibold">
                CaseShell es un mini-juego de investigación donde se simulará un
                sistema operativo en el cual podrás interactuar con:{" "}
                <strong className="text-snow-white border-b border-emerald-500/30">
                  carpetas, imágenes, documentos y una terminal de comandos
                </strong>
                . El objetivo es resolver el caso según las pistas que
                encuentres.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
