import Footer from "@/components/landing/components/Footer";
import Hero from "@/components/landing/components/Hero";
import About from "@/components/landing/components/About";
import Mechanics from "@/components/landing/components/Mechanics";
import Difficulties from "@/components/landing/components/Difficulties";
import Ready from "@/components/landing/components/Ready";
import Navbar from "@/components/landing/components/Navbar";
import WinnerBanner from "@/components/landing/components/WinnerBanner";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black font-sans pb-20 overflow-hidden">
        <WinnerBanner />
        <Hero />
        <About />
        <Mechanics />
        <Difficulties />
        <Ready />
      </main>
      <Footer />
    </>
  );
}
