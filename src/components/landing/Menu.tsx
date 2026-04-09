import Link from "next/link";
import { cn } from "@/components/game/ui/lib/utils";
import type { MenuItem } from "@/config/menus";
import { MENU_ANCHORS } from "@/config/menus";

export default function Menu({
  label,
  href,
  className,
}: MenuItem & { className?: string }) {
  const anchorName = MENU_ANCHORS[href];

  return (
    <Link
      href={href}
      className={cn(
        `relative anchor/[${anchorName}] transition-all duration-200 text-sm font-medium hover:text-red-500`,
        className,
      )}
    >
      {label}
    </Link>
  );
}
