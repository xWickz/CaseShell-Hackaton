"use client";

import DesktopIcon from "@/features/game/ui/desktop/DesktopIcon";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import type { DesktopItem } from "@/features/game/types/game";

type FolderViewerProps = {
  title: string;
  items: DesktopItem[];
};

export default function FolderViewer({ title, items }: FolderViewerProps) {
  const filesystemLocked = useGameSessionStore(
    (state) => state.alertEffectState.filesystemLocked,
  );
  const activeAlert = useGameSessionStore((state) => state.activeAlert);

  return (
    <div className="relative flex h-full w-full flex-col bg-[#ece9d8] text-[11px] text-black">
      <div className="flex gap-4 border-b border-[#d5d2c1] px-2 py-0.5">
        <span>Archivo</span>
        <span>Edición</span>
        <span>Ver</span>
        <span>Favoritos</span>
        <span>Herramientas</span>
        <span>Ayuda</span>
      </div>
      <div className="flex items-center gap-2 border-b border-[#d5d2c1] px-2 py-1">
        <span className="text-[#444]">Dirección</span>
        <span className="flex-1 truncate border border-[#7f9db9] bg-white px-1.5 py-0.5">
          C:\Documents and Settings\Agente\Escritorio\{title}
        </span>
      </div>
      <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 gap-4 overflow-auto border border-[#7f9db9] bg-white p-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <DesktopIcon key={item.id} item={item} insideWindow />
        ))}
      </div>
      <div className="border-t border-[#d5d2c1] px-2 py-0.5 text-[#444]">
        {items.length} objetos
      </div>
      {filesystemLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/85 p-6 text-center font-mono text-emerald-300">
          <p className="text-lg font-semibold">Contenido inaccesible</p>
          <p className="mt-2 text-sm text-emerald-200">
            {activeAlert?.reminder ??
              "Los directorios están sellados hasta resolver la alerta."}
          </p>
        </div>
      )}
    </div>
  );
}
