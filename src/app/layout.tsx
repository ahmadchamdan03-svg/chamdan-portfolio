import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmad Chamdan Yuwafin — Khadimul Ilmi & AI-Driven Web Developer",
  description:
    "Portofolio resmi Ahmad Chamdan Yuwafin (Chamdan). Santri Lirboyo, Khadimul Ilmi, dan AI-Driven Full-Stack Web Developer. Jembatan antara tradisi turats kitab salaf dan rekayasa teknologi modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} ${amiri.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased selection:bg-[#064e3b] selection:text-[#fef08a]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
