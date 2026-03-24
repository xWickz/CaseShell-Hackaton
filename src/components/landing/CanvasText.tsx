"use client";
import { cn } from "@/components/game/ui/lib/utils";
import { CanvasText } from "@/components/game/ui/canvas-text";

interface TextProps {
  className?: string;
  text: string;
}

export function CanvasTxt({ className, text }: TextProps) {
  return (
    <div className="tracking-tighter flex">
      <CanvasText
        text={text}
        className={cn("text-red-500", className)}
        backgroundClassName="bg-red-900 dark:bg-red-700"
        colors={[
          "var(--color-red-500)",
          "var(--color-red-600)",
          "var(--color-red-700)",
          "var(--color-red-800)",
        ]}
        lineGap={5}
        animationDuration={10}
      />
    </div>
  );
}
