"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { HoverBorderGradient } from "@/features/game/ui/ui/hover-border-gradient";

type HoverBorderProps = {
  href: string;
  children: ReactNode;
};

export default function BorderButton({ href, children }: HoverBorderProps) {
  return (
    <div className="flex justify-center text-center">
      <Link href={href} className="inline-block">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="span"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          {children}
        </HoverBorderGradient>
      </Link>
    </div>
  );
}
