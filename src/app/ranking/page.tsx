import Navbar from "@/components/game/ui/navbar";
import Footer from "@/components/game/ui/footer";
import RankingTable from "@/components/game/ranking/RankingTable";

export default function RankingPage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-black pt-24 px-6 pb-20 font-sans text-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <section className="w-full flex flex-col items-center text-center gap-6">
            <h1 className="text-5xl lg:text-6xl text-white font-bold tracking-tight">
              Tabla de <span className="text-red-600">clasificación</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              Selecciona el nivel de investigación. Cada caso presenta retos
              técnicos únicos en la terminal.
            </p>
          </section>

          {/* User Client Component para los filtros y la tabla */}
          <RankingTable />
        </div>
      </main>
      {/* FOOTER */}
      <Footer />
    </>
  );
}
