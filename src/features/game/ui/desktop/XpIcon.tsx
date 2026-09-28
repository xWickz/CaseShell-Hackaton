import type { ReactNode } from "react";
import type { FileType } from "@/features/game/types/game";

// Iconos propios inspirados en XP (no son los originales de Microsoft).
export default function XpIcon({
  type,
  className = "size-12",
}: {
  type: FileType;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="xp-folder" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="1" stopColor="#e8b440" />
        </linearGradient>
        <linearGradient id="xp-page" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#dde6f3" />
        </linearGradient>
        <linearGradient id="xp-title" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d8bff" />
          <stop offset="1" stopColor="#0a4fd6" />
        </linearGradient>
      </defs>
      {GLYPHS[type]}
    </svg>
  );
}

const PAGE = (
  <>
    <path
      d="M10 4h20l9 9v31H10z"
      fill="url(#xp-page)"
      stroke="#7a8aa5"
      strokeWidth="1.2"
    />
    <path d="M30 4v9h9" fill="#c9d6ea" stroke="#7a8aa5" strokeWidth="1.2" />
  </>
);

const GLYPHS: Record<FileType, ReactNode> = {
  folder: (
    <>
      <path d="M3 11h15l4 4h23v26H3z" fill="#d9a22b" stroke="#a8761a" />
      <path
        d="M3 18h42l-3 23H3z"
        fill="url(#xp-folder)"
        stroke="#b8861f"
        strokeWidth="1.2"
      />
    </>
  ),
  text: (
    <>
      {PAGE}
      <path
        d="M15 19h18M15 24h18M15 29h18M15 34h12"
        stroke="#3b6fd1"
        strokeWidth="1.6"
      />
    </>
  ),
  image: (
    <>
      {PAGE}
      <rect x="14" y="18" width="21" height="18" fill="#8fc3f5" />
      <path d="M14 36l7-9 5 6 3-3 6 6z" fill="#4c9a2a" />
      <circle cx="30" cy="22" r="2.5" fill="#ffd84a" />
    </>
  ),
  terminal: (
    <>
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#0a4fd6" />
      <rect x="4" y="8" width="40" height="7" rx="2" fill="url(#xp-title)" />
      <rect x="7" y="15" width="34" height="22" fill="#000" />
      <path
        d="M10 21l4 3-4 3M17 28h7"
        stroke="#c0c0c0"
        strokeWidth="1.8"
        fill="none"
      />
    </>
  ),
  chat: (
    <>
      <path
        d="M6 8h28a4 4 0 014 4v14a4 4 0 01-4 4H18l-8 7v-7H6a4 4 0 01-4-4V12a4 4 0 014-4z"
        fill="#5aa6f0"
        stroke="#1f5fb8"
        strokeWidth="1.2"
      />
      <path
        d="M24 20h16a4 4 0 014 4v10a4 4 0 01-4 4h-2v6l-7-6h-7a4 4 0 01-4-4V24a4 4 0 014-4z"
        fill="#7bd24f"
        stroke="#3b8a1c"
        strokeWidth="1.2"
      />
    </>
  ),
};
