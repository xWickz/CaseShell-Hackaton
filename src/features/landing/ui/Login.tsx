"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { GitHub } from "@/features/game/ui/ui/github";

export default function Login() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <div className="flex justify-end items-center gap-4">
      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <div className="size-8 rounded-full bg-white/10 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:block text-right">
              <p className="text-[11px] text-white/50 uppercase font-bold tracking-tighter">
                Jugador
              </p>
              <p className="text-xs text-white font-medium leading-none">
                {user.name ?? "Usuario"}
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
              <div className="size-8 rounded-full border border-white/20 flex items-center justify-center text-xs text-white bg-white/5">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
            )}

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden sm:block text-[10px] font-black text-white/40 hover:text-red-500 transition-colors uppercase"
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("github")}
            className=" hover:bg-zinc-900 text-white text-xs md:text-sm px-4 py-2 rounded-md transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            <GitHub className="size-4" /> Entrar con GitHub
          </button>
        )}
      </div>
    </div>
  );
}
