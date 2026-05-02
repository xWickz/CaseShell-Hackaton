"use client";

import { SessionProvider } from "next-auth/react";
import Login from "@/features/landing/ui/Login";
import Logo from "@/features/landing/ui/Logo";
import Menu from "@/features/landing/ui/Menu";
import MenuClient from "@/features/landing/ui/MenuClient";
import { MENU_ITEMS } from "@/shared/config/menus";

export default function Navbar() {
  const menuList = MENU_ITEMS.map((item) => {
    return <Menu key={item.label} {...item} />;
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-white/10 bg-void-eclipse/90 font-sans backdrop-blur-md">
      <nav className="mx-auto grid w-full max-w-7xl grid-cols-3 items-center px-4">
        <div className="justify-self-start">
          <Logo />
        </div>

        <div className="justify-self-center">
          <MenuClient>{menuList}</MenuClient>
        </div>

        <div className="justify-self-end">
          <SessionProvider>
            <Login />
          </SessionProvider>
        </div>
      </nav>
    </header>
  );
}
