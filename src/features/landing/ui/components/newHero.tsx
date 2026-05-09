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
    <main className="relative w-full h-screen overflow-hidden bg-zinc-950">
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 pointer-events-none hidden md:block"
      >
        {isVisible && <MyShader text="caseshell" />}
      </div>
      <div className="absolute inset-0 z-1 pointer-events-none flex items-center justify-center md:hidden">
        <h1 className="font-bold text-7xl text-red-600 tracking-tighter">
          CASESHELL
        </h1>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4 pb-10 font-sans">
        <button
          type="button"
          className="px-2 py-1 bg-zinc-950/90 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Scroll para Explorar
        </button>
      </div>
    </main>
  );
}
