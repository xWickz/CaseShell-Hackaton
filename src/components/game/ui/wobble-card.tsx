"use client";

import { motion } from "motion/react";
import type React from "react";
import { cn } from "@/components/game/ui/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  backgroundStyle,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  backgroundStyle?: string;
}) => {
  return (
    <motion.section
      className={cn(
        "mx-auto w-full relative rounded-3xl overflow-hidden border border-white/[0.03] backdrop-blur-sm",
        containerClassName,
      )}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          // Si no pasas nada, usa un gris oscuro neutro
          background: backgroundStyle || "#0a0a0a",
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 h-full sm:mx-0 rounded-3xl overflow-hidden">
        <div className={cn("h-full px-4 py-20 sm:px-10", className)}>
          {children}
          <Noise />
        </div>
      </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-[0.08] pointer-events-none"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "10%",
      }}
    ></div>
  );
};
