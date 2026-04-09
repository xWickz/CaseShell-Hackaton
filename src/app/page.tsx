import About from "@/components/landing/components/About";
import Difficulties from "@/components/landing/components/Difficulties";
import Footer from "@/components/landing/components/Footer";
import Hero from "@/components/landing/components/Hero";
import Mechanics from "@/components/landing/components/Mechanics";
import Navbar from "@/components/landing/components/Navbar";
import Ready from "@/components/landing/components/Ready";
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
