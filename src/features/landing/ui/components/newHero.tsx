"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MyShader = dynamic(
  () => import("../HeroShader").then((m) => m.MyCustomShader),
  {
    ssr: false,
  },
);

export default function ShaderPage() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="intro"
      className="relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Debajo del shader: es lo que se ve en móvil y mientras el shader
          carga en escritorio. El shader es opaco y lo tapa al dibujar. */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <h1 className="font-semibold text-7xl md:text-9xl text-red-600 tracking-tighter md:animate-pulse">
          CASESHELL
        </h1>
      </div>
      <div
        ref={containerRef}
        className="absolute inset-0 z-1 pointer-events-none hidden md:block"
      >
        {isVisible && (
          <div className="h-full w-full animate-in fade-in duration-1000">
            <MyShader text="caseshell" />
          </div>
        )}
      </div>
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4 pb-10 font-sans">
        <a
          href="#about"
          className="px-2 py-1 bg-zinc-950/90 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Scroll para Explorar
        </a>
      </div>
    </section>
  );
}
