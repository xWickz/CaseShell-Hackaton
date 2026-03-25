"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import type { FileType } from "@/types/game";

type FileViewerProps = {
  type: FileType;
  content?: string;
  imageUrl?: string;
};

export default function FileViewer({
  type,
  content,
  imageUrl,
}: FileViewerProps) {
  const filesystemLocked = useGameSessionStore(
    (state) => state.alertEffectState.filesystemLocked,
  );
  const activeAlert = useGameSessionStore((state) => state.activeAlert);

  let viewerContent: ReactNode;

  if (type === "text") {
    viewerContent = (
      <div className="h-full w-full overflow-auto rounded-lg bg-neutral-950 p-4 text-sm text-green-300">
        <pre className="whitespace-pre-wrap font-mono">{content}</pre>
      </div>
    );
  } else if (type === "image") {
    viewerContent = (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-neutral-950 p-4">
        <div className="relative h-full w-full">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Archivo visual"
              fill
              className="max-h-full max-w-full rounded-lg border border-white/10"
            />
          )}
        </div>
      </div>
    );
  } else {
    viewerContent = (
      <div className="rounded-lg bg-neutral-950 p-4 text-sm text-white">
        Archivo no soportado todavía.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {viewerContent}
      {filesystemLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/80 p-6 text-center font-mono text-emerald-300">
          <p className="text-lg font-semibold">Sistema de archivos sellado</p>
          <p className="mt-2 text-sm text-emerald-200">
            {activeAlert?.reminder ??
              "Resuelve la alerta activa para volver a abrir documentos."}
          </p>
          {activeAlert?.resolveCommand && (
            <p className="mt-4 text-xs uppercase tracking-wide text-emerald-300/80">
              Ejecuta {activeAlert.resolveCommand}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
