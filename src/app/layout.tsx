import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  metadataBase: new URL("https://www.chamdan.site"),
  title: "Ahmad Chamdan Yuwafin : Khadimul Ilmi & AI-Driven Web Developer",
  description:
    "Portofolio resmi Ahmad Chamdan Yuwafin (Chamdan). Santri Lirboyo, Khadimul Ilmi, dan AI-Driven Full-Stack Web Developer. Jembatan antara tradisi turats kitab salaf dan rekayasa teknologi modern.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ahmad Chamdan Yuwafin : Khadimul Ilmi & AI-Driven Web Developer",
    description:
      "Santri Lirboyo dan Mahasantri Ma'had Aly Lirboyo yang merajut ketelitian khazanah turats Islam dengan rekayasa web modern Next.js 16, Supabase, dan otomasi cerdas.",
    url: "https://www.chamdan.site",
    siteName: "Ahmad Chamdan Yuwafin",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Chamdan Yuwafin : Khadimul Ilmi & AI-Driven Web Developer",
    description:
      "Santri Lirboyo dan Mahasantri Ma'had Aly Lirboyo yang merajut khazanah turats Islam dengan rekayasa web modern dan otomasi AI.",
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmad Chamdan Yuwafin",
  alternateName: "Chamdan",
  jobTitle: "Khadimul Ilmi & AI-Driven Full-Stack Web Developer",
  description:
    "Santri Pondok Pesantren Lirboyo Kediri dan Mahasantri Ma'had Aly Lirboyo takhassus Fiqh wa Ushuluh, spesialis arsitektur sistem web full-stack dan otomasi AI.",
  url: "https://www.chamdan.site",
  sameAs: [
    "https://github.com/ahmadchamdan03-svg",
    "https://instagram.com",
    "https://linkedin.com",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Ma'had Aly Lirboyo",
    },
    {
      "@type": "EducationalOrganization",
      name: "Madrasah Hidayatul Mubtadi-in (MHM) Lirboyo",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kediri",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased selection:bg-[#064e3b] selection:text-[#fef08a]">
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
