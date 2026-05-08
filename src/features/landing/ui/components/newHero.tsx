"use client";
import dynamic from "next/dynamic";

const MyShader = dynamic(
  () => import("../HeroShader").then((m) => m.MyCustomShader),
  {
    ssr: false,
  },
);

export default function ShaderPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* CAPA 1: El Shader (Fondo y el logo "caseshell" integrado) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <MyShader text="caseshell" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4 pb-10 font-sans">
        <button
          type="button"
          className="px-2 py-1 bg-black/90 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Scroll para Explorar
        </button>
      </div>
    </main>
  );
}
