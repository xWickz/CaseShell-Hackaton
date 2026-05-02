export type MenuItem = {
  label: string;
  href: string;
};

export const MENU_ITEMS: MenuItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Jugar", href: "/game" },
  { label: "Clasificación", href: "/ranking" },
];

export const MENU_ANCHORS: Record<string, string> = {
  "/": "--anchor-nav-inicio",
  "/game": "--anchor-nav-jugar",
  "/ranking": "--anchor-nav-clasificacion",
};
