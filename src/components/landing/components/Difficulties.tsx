export default function Difficulties() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-32">
      <div className="flex flex-col items-center lg:items-start w-full gap-10 border-t border-white/10 pt-20 timeline-view animate-slide-in-left animate-range-[entry_5%_contain_20%]">
        <section className="w-full">
          <h2 className="text-3xl text-white font-semibold tracking-tight mb-8 text-center lg:text-left">
            Dificultades
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
              <h3 className="text-2xl lg:text-xl font-semibold text-green-400 mb-3 lg:mb-2">
                Fácil
              </h3>
              <p className="text-slate-400">
                Pistas claras, pocos archivos y comandos básicos. Ideal para
                principiantes y tener una noción básica del juego.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
              <h3 className="text-2xl lg:text-xl font-semibold text-orange-400 mb-3 lg:mb-2">
                Intermedio
              </h3>
              <p className="text-slate-400">
                Más archivos, pistas menos directas y comandos avanzados.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
              <h3 className="text-2xl lg:text-xl font-semibold text-red-500 mb-3 lg:mb-2">
                Difícil
              </h3>
              <p className="text-slate-400">
                Gran cantidad de archivos, pistas crípticas y uso intensivo de
                la terminal.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
