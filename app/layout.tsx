import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "Corsia Sicura – Cyber Academy",
  description: "Percorso di Cyber Security Awareness in 24 episodi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <a href="#contenuto" className="skip-link">
          Vai al contenuto
        </a>
        {children}
      </body>
    </html>
  );
}
