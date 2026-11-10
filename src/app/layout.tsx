import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chamdan.site"),
  title: "Ahmad Chamdan Yuwafin : Khadimul Ilmi & AI-Driven Web Developer",
  description:
    "Portofolio resmi Ahmad Chamdan Yuwafin (Chamdan). Santri Lirboyo, Khadimul Ilmi, dan AI-Driven Full-Stack Web Developer. Jembatan antara tradisi turats kitab salaf dan rekayasa teknologi modern.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
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
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${amiri.variable} scroll-smooth`}
    >
      <head>
        {/* Preload Hero LCP Images for ultra-fast first contentful paint */}
        <link
          rel="preload"
          as="image"
          href="/images/hero/jacket.png"
          type="image/png"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero/blueshirt.png"
          type="image/png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="min-h-screen bg-[#fafaf9] dark:bg-stone-950 text-[#1c1917] dark:text-stone-100 font-sans antialiased selection:bg-[#064e3b] selection:text-[#fef08a] transition-colors">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
