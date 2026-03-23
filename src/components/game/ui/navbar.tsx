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
    <nav className="font-sans fixed top-0 left-0 w-full h-16 bg-black/50 backdrop-blur-sm border-b border-white/10 z-30 flex items-center justify-between px-10 lg:px-20">
      <span className="tracking-tight text-white font-bold text-xl">
        <Link href="/" role="button">
          Case<span className="text-red-600">Shell</span>
        </Link>
      </span>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          role="button"
          className={
            pathname === "/"
              ? "text-sm text-white font-bold"
              : "text-sm text-white transition hover:text-white/90 hover:font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg px-3 py-1"
          }
        >
          Inicio
        </Link>
        <Link
          href="/game"
          role="button"
          className={
            pathname === "/game"
              ? "text-sm text-white font-bold"
              : "text-sm text-white transition hover:text-white/90 hover:font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg px-3 py-1"
          }
        >
          Jugar
        </Link>
        <Link
          href="/ranking"
          role="button"
          className={
            pathname === "/ranking"
              ? "text-sm text-white font-bold"
              : "text-sm text-white transition hover:text-white/90 hover:font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg px-3 py-1"
          }
        >
          Clasificación
        </Link>
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="text-xs text-white/70">Cargando...</span>
          ) : user ? (
            <>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full border border-white/30"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-sm text-white/80">
                  {(user.name ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs font-semibold text-white/80 transition hover:text-white"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                signIn("github", { callbackUrl: window.location.href })
              }
              className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
