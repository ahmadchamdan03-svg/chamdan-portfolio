"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import { Mail, ArrowUp } from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const toggleLang = () => {
    setLang((prev) => (prev === "ID" ? "EN" : "ID"));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9] text-[#1c1917]">
      {/* Fixed Navbar with Glassmorphism */}
      <Navbar currentLang={lang} onToggleLang={toggleLang} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          name="CHAMDAN"
          tagline="Santri Lirboyo, Khadimul Ilmi dan AI-Driven Web Developer"
          lang={lang}
        />

        {/* Projects Section (Connected to Supabase) */}
        <ProjectsSection lang={lang} />
      </main>

      {/* Contact & Footer Section */}
      <footer id="contact" className="relative bg-[#0c1311] text-[#f5f5f4] pt-24 pb-12 px-4 sm:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 border-b border-stone-800 gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#fbbf24] font-semibold mb-3">
                {lang === "ID" ? "TERBUKA UNTUK KOLABORASI" : "OPEN FOR COLLABORATION"}
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white">
                {lang === "ID" ? (
                  <>
                    Ada rencana proyek? <br />
                    <span className="italic text-emerald-400">Mari berdiskusi.</span>
                  </>
                ) : (
                  <>
                    Have a project in mind? <br />
                    <span className="italic text-emerald-400">Let&apos;s talk.</span>
                  </>
                )}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="mailto:ahmadchamdan03@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-stone-950 hover:bg-[#fbbf24] font-semibold text-sm transition-all duration-200 shadow-lg"
              >
                <Mail className="w-4 h-4 text-emerald-800" />
                <span>ahmadchamdan03@gmail.com</span>
              </a>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-sm font-medium border border-stone-700 transition-colors"
                aria-label="Kembali ke atas"
              >
                <span>{lang === "ID" ? "Ke Atas" : "Back to top"}</span>
                <ArrowUp className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-16 border-b border-stone-800/80 text-sm">
            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-400 mb-4">Navigasi</h4>
              <ul className="space-y-2.5 text-stone-300">
                <li><a href="#home" className="hover:text-emerald-400 transition-colors">Beranda</a></li>
                <li><a href="#projects" className="hover:text-emerald-400 transition-colors">Karya &amp; Proyek</a></li>
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Kontak</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-400 mb-4">Jejaring Sosial</h4>
              <ul className="space-y-2.5 text-stone-300">
                <li>
                  <a
                    href="https://github.com/chamdan-as"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub (@chamdan-as)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs tracking-wider uppercase text-stone-400 mb-4">Identitas &amp; Afiliasi</h4>
              <p className="text-stone-300 leading-relaxed text-sm">
                Ahmad Chamdan Yuwafin (Chamdan)<br />
                Pondok Pesantren Lirboyo, Kediri, Jawa Timur.<br />
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Tersedia untuk proyek freelance &amp; institusi
                </span>
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Massive Name */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>&copy; 2026 Ahmad Chamdan Yuwafin. Seluruh hak cipta dilindungi.</p>
            <p className="font-mono text-stone-400">Next.js &bull; Supabase &bull; Tailwind CSS &bull; Vercel</p>
          </div>

          {/* Massive Outro Text */}
          <div className="mt-12 text-center select-none overflow-hidden">
            <div className="font-sans font-black text-[13vw] leading-[0.75] tracking-tighter uppercase text-stone-800/40">
              CHAMDAN DEV
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
