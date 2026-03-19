"use client";

import { GitHub } from "@/components/game/ui/github";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <footer className="bg-zinc-950 border-t border-white/10 px-6 md:px-10 lg:px-20">
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
          >
            <GitHub className="w-8 h-8 lg:w-6 lg:h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
