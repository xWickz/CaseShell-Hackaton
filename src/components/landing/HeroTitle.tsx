"use client";
import { cn } from "@/components/game/ui/lib/utils";
import { CanvasText } from "@/components/game/ui/canvas-text";

export function HeroTitle() {
  return (
    <div className="tracking-tighter flex">
      <h1 className="text-2xl font-bold md:text-4xl lg:text-6xl text-white">
        Case
      </h1>
      <CanvasText
        text="Shell"
        className="text-2xl font-bold md:text-4xl lg:text-6xl text-red-500 "
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
