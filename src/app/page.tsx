import Navbar from "@/components/game/ui/navbar";
import Footer from "@/components/game/ui/footer";
import Hero from "@/components/landing/components/Hero";
import About from "@/components/landing/components/About";
import Mechanics from "@/components/landing/components/Mechanics";
import Difficulties from "@/components/landing/components/Difficulties";

export default function HomePage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-black font-sans pb-20 overflow-hidden">
        <Hero />
        <About />
        <Mechanics />
        <Difficulties />
      </main>
      <Footer />
    </>
  );
}
