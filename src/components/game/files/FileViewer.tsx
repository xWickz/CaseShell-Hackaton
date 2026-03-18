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
  if (type === "text") {
    return (
      <div className="h-full w-full overflow-auto rounded-lg bg-neutral-950 p-4 text-sm text-green-300">
        <pre className="whitespace-pre-wrap font-mono">{content}</pre>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-neutral-950 p-4">
        <img
          src={imageUrl}
          alt="Archivo visual"
          className="max-h-full max-w-full rounded-lg border border-white/10"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-950 p-4 text-sm text-white">
      Archivo no soportado todavía.
    </div>
  );
}
