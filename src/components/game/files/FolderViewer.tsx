import type { DesktopItem } from "@/types/game";
import DesktopIcon from "@/components/game/desktop/DesktopIcon";

type FolderViewerProps = {
  items: DesktopItem[];
};

export default function FolderViewer({ items }: FolderViewerProps) {
  return (
    <div className="h-full overflow-auto rounded-lg bg-neutral-950 p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <DesktopIcon key={item.id} item={item} insideWindow />
        ))}
      </div>
    </div>
  );
}
