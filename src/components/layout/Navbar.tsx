"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Menu,
  X,
  Globe,
  Search,
  Sun,
  Moon,
  Settings,
  Lock,
} from "lucide-react";
import { useTheme } from "next-themes";
import AmbientAudio from "@/components/ui/AmbientAudio";

interface NavbarProps {
  currentLang?: "ID" | "EN" | "AR";
  onSelectLang?: (lang: "ID" | "EN" | "AR") => void;
  onToggleLang?: () => void;
  onOpenSearch?: () => void;
}

export default function Navbar({
  currentLang = "ID",
  onSelectLang,
  onToggleLang,
  onOpenSearch,
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsOpen]);

  const navItems = [
    { id: "home", labelID: "Beranda", labelEN: "Home", labelAR: "الرئيسية" },
    { id: "about", labelID: "Profil", labelEN: "About", labelAR: "نبذة" },
    { id: "skills", labelID: "Keahlian", labelEN: "Skills", labelAR: "المهارات" },
    { id: "projects", labelID: "Proyek", labelEN: "Projects", labelAR: "الأعمال" },
    { id: "services", labelID: "Layanan", labelEN: "Services", labelAR: "الخدمات" },
    { id: "schedule", labelID: "Jadwal", labelEN: "Schedule", labelAR: "الجدول" },
    { id: "education", labelID: "Sanad", labelEN: "Sanad", labelAR: "السند" },
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
    setSettingsOpen(false);
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLangSelect = (newLang: "ID" | "EN" | "AR") => {
    if (onSelectLang) {
      onSelectLang(newLang);
    } else if (onToggleLang) {
      onToggleLang();
    }
    if (typeof document !== "undefined") {
      if (newLang === "AR") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = newLang.toLowerCase();
      }
    }
  };

  const getLabel = (item: (typeof navItems)[0]) => {
    if (currentLang === "AR") return item.labelAR;
    if (currentLang === "EN") return item.labelEN;
    return item.labelID;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none transition-all duration-300">
      <div className="w-full max-w-5xl flex items-center justify-between pointer-events-auto">
        {/* Left: Brand Logo Emblem */}
        <Link
          href="#home"
          className="group flex items-center justify-center w-11 h-11 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-all duration-200 border-2 border-emerald-600/50 bg-stone-900 shrink-0"
          aria-label="Ahmad Chamdan Yuwafin : Kembali ke Beranda"
        >
          <Image
            src="/images/logo.png"
            width={40}
            height={40}
            alt="Logo Chamdan"
            className="w-full h-full object-cover rounded-full"
            priority
          />
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
                {getLabel(item)}
              </a>
            );
          })}
        </nav>

        {/* Right: Consolidated Settings Menu Dropdown & Contact CTA */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          {/* Contact Me CTA */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#064e3b] text-[#fef3c7] hover:bg-[#022c22] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-600/40"
          >
            <span>
              {currentLang === "AR"
                ? "تواصل معي"
                : currentLang === "EN"
                ? "Contact Me"
                : "Hubungi Saya"}
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#fbbf24]" />
          </a>

          {/* Consolidated Settings Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border transition-all duration-200 shadow-md cursor-pointer ${
              settingsOpen
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30"
                : "border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-600"
            }`}
            aria-label="Pengaturan, Bahasa, Tema & Menu Cepat"
            title="Pengaturan & Preferensi"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Dropdown Popover */}
          {settingsOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-stone-900/95 backdrop-blur-2xl border border-stone-700/80 p-4 shadow-2xl text-stone-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Language Switcher */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                  Bahasa / Language
                </span>
                <div className="grid grid-cols-3 gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800">
                  {(["ID", "EN", "AR"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => handleLangSelect(l)}
                      className={`py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        currentLang === l
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-stone-400 hover:text-white hover:bg-stone-800"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Audio Row */}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-300 font-medium">Tema Gelap / Terang</span>
                {mounted && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 border border-stone-700 cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Gelap</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-stone-300" />
                        <span>Terang</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-300 font-medium">Audio Ambien</span>
                <AmbientAudio />
              </div>

              {/* Quick Search trigger */}
              <button
                type="button"
                onClick={triggerSearch}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 text-xs text-stone-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cari Cepat</span>
                </div>
                <span className="font-mono text-[10px] text-stone-400 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-700">
                  Cmd K
                </span>
              </button>

              {/* Admin Portal Link */}
              <Link
                href="/login"
                onClick={() => setSettingsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-600/30 text-xs text-emerald-300 font-medium transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-stone-900/95 text-white backdrop-blur-md border border-white/15 shadow-lg cursor-pointer"
            aria-label={mobileMenuOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
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
              {getLabel(item)}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#064e3b] text-[#fef3c7] font-semibold text-sm"
          >
            <span>
              {currentLang === "AR"
                ? "تواصل معي"
                : currentLang === "EN"
                ? "Contact Me"
                : "Hubungi Saya"}
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#fbbf24]" />
          </a>
        </div>
      )}
    </header>
  );
}
