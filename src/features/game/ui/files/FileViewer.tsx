"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useGameSessionStore } from "@/features/game/store/useGameSessionStore";
import type { FileType } from "@/features/game/types/game";

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
      <div className="flex h-full w-full flex-col bg-[#ece9d8] text-black">
        <div className="flex gap-4 px-2 py-0.5 text-[11px]">
          <span>Archivo</span>
          <span>Edición</span>
          <span>Formato</span>
          <span>Ver</span>
          <span>Ayuda</span>
        </div>
        <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap border border-[#7f9db9] bg-white p-1 font-['Lucida_Console',_'Courier_New',_monospace] text-[13px]">
          {content}
        </pre>
      </div>
    );
  } else if (type === "image") {
    viewerContent = (
      <div className="flex h-full w-full flex-col bg-white">
        <div className="relative min-h-0 flex-1 p-3">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Archivo visual"
              fill
              className="object-contain p-3"
            />
          )}
        </div>
        <div className="border-t border-[#d5d2c1] bg-[#ece9d8] px-2 py-1 text-center text-[11px] text-[#444]">
          Visor de imágenes
        </div>
      </div>
    );
  } else {
    viewerContent = (
      <div className="h-full w-full bg-white p-4 text-[11px] text-black">
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
