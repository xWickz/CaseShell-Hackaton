"use client";
import { ReactNode } from "react";
import { HoverBorderGradient } from "@/components/game/ui/hover-border-gradient";
import Link from "next/link";

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
