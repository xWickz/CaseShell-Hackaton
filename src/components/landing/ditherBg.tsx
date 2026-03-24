"use client";
import { DitherShader } from "@/components/game/ui/dither-shade";

export function DitherMatrix() {
  return (
    <div className="w-full h-full overflow-hidden pointer-events-none">
      <DitherShader
        src="/matrix-bg.webp"
        gridSize={2}
        ditherMode="noise"
        colorMode="duotone"
        primaryColor="#03170c"
        secondaryColor="#4ade80"
        objectFit="cover"
        className="w-full h-full opacity-30"
      />
    </div>
  );
}
