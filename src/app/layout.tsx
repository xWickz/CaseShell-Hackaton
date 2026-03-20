import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://wawa-cases-wickz-hi2ufv-f7affe-157-254-174-56.traefik.me/",
  ),
  title: {
    default: "CaseShell | The Ultimate Terminal Puzzle",
    template: "%s | CaseShell",
  },
  description:
    "Hackea el sistema. Resuelve el caso. Un simulador de sistema operativo donde tu terminal es la escena del crimen. Creado para la Hackathon de CubePath.",
  keywords: [
    "hackathon",
    "cubepath",
    "terminal",
    "puzzle",
    "juego",
    "os simulator",
    "sysadmin",
    "ciberseguridad",
  ],
  authors: [{ name: "Wickz", url: "https://wickz.dev" }],
  creator: "Wickz",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://wawa-cases-wickz-hi2ufv-f7affe-157-254-174-56.traefik.me/",
    title: "CaseShell | The Ultimate Terminal Puzzle",
    description:
      "Hackea el sistema. Resuelve el caso. Un simulador de sistema operativo donde tu terminal es la escena del crimen.",
    siteName: "CaseShell",
    images: [
      {
        url: "/og-image.png", // Next.js lo tomará de public/ o de src/app/
        width: 1200,
        height: 630,
        alt: "CaseShell - Pantalla principal con efecto glitch",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
