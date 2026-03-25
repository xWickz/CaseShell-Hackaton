"use client";

import type { DesktopItem } from "@/types/game";
import DesktopIcon from "@/components/game/desktop/DesktopIcon";
import { useGameSessionStore } from "@/store/useGameSessionStore";

type FolderViewerProps = {
  items: DesktopItem[];
};

export default function FolderViewer({ items }: FolderViewerProps) {
  const filesystemLocked = useGameSessionStore(
    (state) => state.alertEffectState.filesystemLocked,
  );
  const activeAlert = useGameSessionStore((state) => state.activeAlert);

  return (
    <div className="relative h-full w-full overflow-auto rounded-lg bg-neutral-950 p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <DesktopIcon key={item.id} item={item} insideWindow />
        ))}
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
