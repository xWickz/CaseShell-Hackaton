"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { AppSessionProvider } from "@/components/providers/AppSessionProvider";

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

  return (
    <nav className="font-sans fixed top-0 left-0 w-full bg-black/50 backdrop-blur-sm border-b border-white/10 z-30 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:h-16 md:px-10 lg:px-20">
      {/* LOGO */}
      <span className="tracking-tight text-white font-bold text-xl mb-4 md:mb-0">
        <Link href="/" role="button">
          Case<span className="text-red-600">Shell</span>
        </Link>
      </span>

      {/* ENLACES Y ACCIONES */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <Link
          href="/"
          role="button"
          className={
            pathname === "/"
              ? "text-xs md:text-sm text-white font-bold"
              : "text-xs md:text-sm text-white transition hover:text-white/90 hover:font-bold px-2 py-1"
          }
        >
          Inicio
        </Link>
        <Link
          href="/game"
          role="button"
          className={
            pathname === "/game"
              ? "text-xs md:text-sm text-white font-bold"
              : "text-xs md:text-sm text-white transition hover:text-white/90 hover:font-bold px-2 py-1"
          }
        >
          Jugar
        </Link>
        <Link
          href="/ranking"
          role="button"
          className={
            pathname === "/ranking"
              ? "text-xs md:text-sm text-white font-bold"
              : "text-xs md:text-sm text-white transition hover:text-white/90 hover:font-bold px-2 py-1"
          }
        >
          Clasificación
        </Link>

        {/* SECCIÓN DE USUARIO */}
        <div className="flex items-center gap-2 ml-2 border-l border-white/10 pl-4 md:border-none md:pl-0">
          {status === "loading" ? (
            <span className="text-[10px] text-white/70">Cargando...</span>
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  width={24}
                  height={24}
                  className="rounded-full border border-white/30 md:w-8 md:h-8"
                />
              ) : (
                <span className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full border border-white/30 text-[10px] md:text-sm text-white/80">
                  {(user.name ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[10px] md:text-xs font-semibold text-white/80 transition hover:text-white"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                signIn("github", { callbackUrl: window.location.href })
              }
              className="rounded-full border border-white/30 px-3 py-1 text-[10px] md:text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
