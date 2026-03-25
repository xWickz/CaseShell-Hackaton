"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { AppSessionProvider } from "@/components/providers/AppSessionProvider";
import { useState } from "react";
import { cn } from "@/components/game/ui/lib/utils"; // Asegúrate de tener esta util o usa la función de abajo

export default function Navbar() {
  return (
    <AppSessionProvider>
      <NavbarContent />
    </AppSessionProvider>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

  // Estilos para los links centrales
  const linkStyles = (path: string) =>
    cn(
      "transition-all duration-200 text-sm font-medium hover:text-red-500",
      pathname === path ? "text-red-600 font-bold" : "text-white/90",
    );

  return (
    <nav className="bg-black/90 backdrop-blur-md fixed w-full z-50 top-0 start-0 border-b border-white/10 h-16 flex items-center font-sans">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 items-center w-full">
        <div className="flex justify-start">
          <Link href="/" className="flex items-center group">
            <span className="text-xl md:text-2xl font-bold whitespace-nowrap text-white">
              Case
              <span className="text-red-600 group-hover:text-red-500 transition-colors">
                Shell
              </span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex justify-center items-center">
          <ul className="flex flex-row space-x-10">
            <li>
              <Link href="/" className={linkStyles("/")}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/game" className={linkStyles("/game")}>
                Jugar
              </Link>
            </li>
            <li>
              <Link href="/ranking" className={linkStyles("/ranking")}>
                Clasificación
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex justify-end items-center gap-4">
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <p className="text-[11px] text-white/50 uppercase font-bold tracking-tighter">
                    Jugador
                  </p>
                  <p className="text-xs text-white font-medium leading-none">
                    {user.name}
                  </p>
                </div>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full border border-white/20 hover:border-red-500 transition-colors cursor-pointer"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-xs text-white bg-white/5">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden sm:block text-[10px] font-black text-white/40 hover:text-red-500 transition-colors uppercase"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-md transition-all active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Entrar con GitHub
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 text-gray-400 rounded-lg md:hidden hover:bg-white/10 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black border-b border-white/10 md:hidden flex flex-col p-4 space-y-4 shadow-2xl">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={linkStyles("/")}
          >
            Inicio
          </Link>
          <Link
            href="/game"
            onClick={() => setIsOpen(false)}
            className={linkStyles("/game")}
          >
            Jugar
          </Link>
          <Link
            href="/ranking"
            onClick={() => setIsOpen(false)}
            className={linkStyles("/ranking")}
          >
            Clasificación
          </Link>
          {user && (
            <button
              onClick={() => signOut()}
              className="text-left text-red-500 font-bold text-sm pt-2 border-t border-white/5"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
