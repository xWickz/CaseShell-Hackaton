"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/components/game/ui/lib/utils";
import { MENU_ANCHORS, MENU_ITEMS } from "@/config/menus";

const ANCHOR_CLASSES: Record<string, string> = {
  "/": "anchored/[--anchor-nav-inicio]",
  "/game": "anchored/[--anchor-nav-jugar]",
  "/ranking": "anchored/[--anchor-nav-clasificacion]",
};

export default function MenuClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const activeAnchorClass = ANCHOR_CLASSES[pathname] ?? ANCHOR_CLASSES["/"];

  const dynamicCSS = `
    ${MENU_ITEMS.map(
      (item) => `
      #main-nav:has(a[href="${item.href}"]:hover) .nav-underline {
        position-anchor: ${MENU_ANCHORS[item.href]};
      }
    `,
    ).join("")}
  `;

  const newChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const { href, className } = child.props as {
      href: string;
      className?: string;
    };

    const isActive = pathname === href;

    return React.cloneElement(
      child as React.ReactElement<{ className?: string }>,
      {
        className: cn(
          "text-white",
          className,
          isActive && "text-red-500 font-bold uppercase",
        ),
      },
    );
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dynamicCSS }} />
      <nav id="main-nav" className="relative flex gap-3">
        {newChildren}
        <div
          className={cn(
            "nav-underline top-anchor-bottom left-anchor-left w-anchor absolute h-[3px] bg-red-500 transition-all duration-500 ease-in-out ",
            activeAnchorClass,
          )}
        />
      </nav>
    </>
  );
}
