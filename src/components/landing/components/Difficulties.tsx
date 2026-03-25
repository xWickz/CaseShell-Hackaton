export default function Difficulties() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <section className="relative w-full border-t border-white/10 bg-black overflow-hidden">
        <div className="px-6 md:px-10 lg:px-20 py-24 md:py-32">
          <h2 className="text-3xl md:text-5xl text-white font-bold tracking-tighter font-mono flex flex-wrap justify-center lg:justify-start items-center">
            Dificultades
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
              <h3 className="text-2xl lg:text-xl font-semibold text-white mb-3 lg:mb-2">
                Fácil
              </h3>
              <p className="text-slate-400">
                Pistas claras, pocos archivos y comandos básicos. Ideal para
                principiantes y tener una noción básica del juego.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
              <h3 className="text-2xl lg:text-xl font-semibold text-white mb-3 lg:mb-2">
                Intermedio
              </h3>
              <p className="text-slate-400">
                Más archivos, pistas menos directas y comandos avanzados.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
              <h3 className="text-2xl lg:text-xl font-semibold  text-white mb-3 lg:mb-2">
                Difícil
              </h3>
              <p className="text-slate-400">
                Gran cantidad de archivos, pistas crípticas y uso intensivo de
                la terminal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
