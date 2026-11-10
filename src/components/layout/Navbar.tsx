"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Globe, Search } from "lucide-react";

interface NavbarProps {
  currentLang?: "ID" | "EN";
  onToggleLang?: () => void;
  onOpenSearch?: () => void;
}

export default function Navbar({
  currentLang = "ID",
  onToggleLang,
  onOpenSearch,
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: "home", labelID: "Beranda", labelEN: "Home" },
    { id: "about", labelID: "Profil", labelEN: "About" },
    { id: "skills", labelID: "Keahlian", labelEN: "Skills" },
    { id: "projects", labelID: "Proyek", labelEN: "Projects" },
    { id: "experience", labelID: "Pengalaman", labelEN: "Experience" },
    { id: "education", labelID: "Pendidikan", labelEN: "Education" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      // Dispatch keydown event for Cmd+K
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none transition-all duration-300">
      <div className="w-full max-w-5xl flex items-center justify-between pointer-events-auto">
        {/* Left: Brand Inisial "C" */}
        <Link
          href="#home"
          className="group flex items-center justify-center w-11 h-11 rounded-full bg-[#064e3b] text-[#fbbf24] font-serif font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200 border border-emerald-600/50"
          aria-label="Kembali ke Beranda"
        >
          <span>C</span>
        </Link>

        {/* Center: Desktop Navigation Pills */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-stone-900/95 text-stone-300 backdrop-blur-md border border-white/15 shadow-2xl"
          aria-label="Navigasi Utama"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-white text-stone-950 font-semibold shadow-sm"
                    : "hover:text-white hover:bg-white/10"
                }`}
              >
                {currentLang === "ID" ? item.labelID : item.labelEN}
              </a>
            );
          })}
        </nav>

        {/* Right: Search, Language toggle & Contact CTA */}
        <div className="flex items-center gap-2">
          {/* Universal Search trigger */}
          <button
            type="button"
            onClick={triggerSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-300 text-xs font-semibold text-stone-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-md"
            aria-label="Cari Cepat (Cmd + K)"
            title="Cari Cepat (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline-block font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
              Cmd K
            </span>
          </button>

          {/* Lang Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-300 text-xs font-semibold text-stone-800 hover:border-emerald-600 transition-colors shadow-md"
            aria-label="Ganti Bahasa"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentLang}</span>
          </button>

          {/* Contact Me CTA */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#064e3b] text-[#fef3c7] hover:bg-[#022c22] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-600/40"
          >
            <span>{currentLang === "ID" ? "Hubungi Saya" : "Contact Me"}</span>
            <ArrowUpRight className="w-4 h-4 text-[#fbbf24]" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-stone-900/95 text-white backdrop-blur-md border border-white/15 shadow-lg"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-[100] bg-stone-900/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 pointer-events-auto md:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-[#064e3b] text-[#fbbf24] font-semibold"
                  : "text-stone-200 hover:bg-white/10"
              }`}
            >
              {currentLang === "ID" ? item.labelID : item.labelEN}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#064e3b] text-[#fef3c7] font-semibold text-sm"
          >
            <span>{currentLang === "ID" ? "Hubungi Saya" : "Contact Me"}</span>
            <ArrowUpRight className="w-4 h-4 text-[#fbbf24]" />
          </a>
        </div>
      )}
    </header>
  );
}
