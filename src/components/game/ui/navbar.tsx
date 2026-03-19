import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="font-sans fixed top-0 left-0 w-full h-16 bg-black/50 backdrop-blur-sm border-b border-white/10 z-30 flex items-center justify-between px-10 lg:px-20">
      <span className="tracking-tight text-white font-bold text-xl">
        Case<span className="text-red-600">Shell</span>
      </span>
      <div>
        <Link
          href="/"
          role="button"
          className="text-sm text-white transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg px-3 py-1"
        >
          Inicio
        </Link>
        <Link
          href="/game"
          role="button"
          className="text-sm text-white transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg px-3 py-1"
        >
          Jugar
        </Link>
        <Link
          href="/ranking"
          role="button"
          className="text-sm text-white transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg px-3 py-1"
        >
          Clasificación
        </Link>
      </div>
    </nav>
  );
}
