"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/game/ui/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <motion.section
      className={cn(
        "mx-auto w-full relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-sm",
        containerClassName,
      )}
    >
      {/* Degradado base premium con efecto radial */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(135% 135% at 15% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 85% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                      linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.3) 100%)`,
        }}
      />

      {/* Capa de brillo diagonal premium */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 60%, rgba(0, 0, 0, 0.15) 100%)`,
        }}
      />

      <div
        className="relative z-10 h-full sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "inset 0 1px 2px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0px 20px rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className={cn("h-full px-4 py-20 sm:px-10", className)}>
          <Noise />
          {children}
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
        backgroundSize: "30%",
      }}
    ></div>
  );
};
