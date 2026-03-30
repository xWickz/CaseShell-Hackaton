"use client";
import { signIn, signOut } from "next-auth/react";
import { GitHub } from "@/components/game/ui/github";
export default function Login() {
  return (
    <div className="flex justify-end items-center gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => signIn("github")}
          className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs md:text-sm px-4 py-2 rounded-md transition-all active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex justify-center items-center gap-2"
        >
          <GitHub className="w-4 h-4" /> Entrar con GitHub
        </button>
      </div>
    </div>
  );
}
