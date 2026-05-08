import About from "@/features/landing/ui/components/About";
import Difficulties from "@/features/landing/ui/components/Difficulties";
import Footer from "@/features/landing/ui/components/Footer";
import Hero from "@/features/landing/ui/components/Hero";
import Mechanics from "@/features/landing/ui/components/Mechanics";
import Navbar from "@/features/landing/ui/components/Navbar";
import ShaderPage from "@/features/landing/ui/components/newHero";
import Ready from "@/features/landing/ui/components/Ready";
import SecondHero from "@/features/landing/ui/components/secondHero";
import WinnerBanner from "@/features/landing/ui/components/WinnerBanner";
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black font-sans pb-20 overflow-hidden">
        <ShaderPage />
        <SecondHero />
        <Mechanics />
        <Difficulties />
        <Ready />
      </main>
      <Footer />
    </>
  );
}
