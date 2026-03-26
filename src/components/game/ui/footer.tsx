"use client";

import { GitHub } from "@/components/game/ui/github";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TextHoverEffect } from "@/components/game/ui/text-hover-effect";
import { motion, AnimatePresence } from "motion/react"; // Importamos para el tooltip
import { useState } from "react";

const ContributorAvatar = ({ src, name }: { src: string; name: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-bold rounded-md whitespace-nowrap shadow-xl z-50"
          >
            {name}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <Image
        className="w-10 h-10 border-2 border-zinc-900 rounded-full cursor-pointer hover:border-gray-500 transition-colors"
        src={src}
        width={40}
        height={40}
        alt={name}
        loading="lazy"
      />
    </div>
  );
};

export default function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <footer className="bg-zinc-950 border-t border-white/10 px-6 md:px-10 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between py-10 text-sm text-zinc-400 font-sans gap-8">
        <div className="flex-1 text-center lg:text-left order-3 lg:order-1">
          <p>
            Desarrollado por{" "}
            <a
              href="https://wickz.dev"
              className="font-bold text-zinc-300 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wickz
            </a>
          </p>
          <p className="text-xs text-zinc-500 mt-1">© 2026</p>
        </div>
        <div className="flex-1 text-center order-1 lg:order-2">
          {isLanding ? (
            <a
              href="#intro"
              className="text-white text-md border rounded-full border-white/30 px-6 py-2 font-bold transition-colors hover:bg-white hover:text-black"
            >
              Volver arriba
            </a>
          ) : (
            <Link
              href="/"
              className="text-white text-md border rounded-full border-white/30 px-6 py-2 font-bold transition-colors hover:bg-white hover:text-black"
            >
              Menú Principal
            </Link>
          )}
        </div>
        <div className="flex-1 flex justify-center lg:justify-end order-2 lg:order-3">
          <a
            href="https://github.com/xWickz/CaseShell-Hackaton"
            className="text-zinc-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir el repositorio de CaseShell en GitHub"
          >
            <GitHub className="w-8 h-8 lg:w-6 lg:h-6" />
            <span className="sr-only">Repositorio de CaseShell en GitHub</span>
          </a>
        </div>
      </div>

      <hr className="border-white/5" />

      <div className="py-10 flex flex-col items-center justify-center text-white font-sans gap-4">
        <h3 className="font-bold text-lg tracking-wide text-white">
          Contribuidores
        </h3>
        <section className="flex -space-x-3 rtl:space-x-reverse">
          <ContributorAvatar
            name="Alphabeath"
            src="https://avatars.githubusercontent.com/u/66189321?v=4"
          />
          <ContributorAvatar
            name="emecarrellan"
            src="https://avatars.githubusercontent.com/u/105559539?v=4"
          />
        </section>
      </div>

      <hr className="border-white/5" />

      <div className="h-64 md:h-80 flex items-center justify-center -mt-4">
        <TextHoverEffect text="CASESHELL" />
      </div>
    </footer>
  );
}
