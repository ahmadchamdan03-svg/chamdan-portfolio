"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WritingsSection from "@/components/sections/WritingsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import JadwalKajianSection from "@/components/sections/JadwalKajianSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import CursorTrail from "@/components/ui/CursorTrail";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import IntroLoader from "@/components/ui/IntroLoader";
import EasterEgg from "@/components/ui/EasterEgg";
import LeadMagnetModal from "@/components/ui/LeadMagnetModal";
import CookieBanner from "@/components/ui/CookieBanner";

// Lazy load below-the-fold and heavy interactive components
const GallerySection = dynamic(
  () => import("@/components/sections/GallerySection"),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 bg-[#0c1410] flex flex-col items-center justify-center min-h-[460px] text-stone-400">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-3" />
        <span className="text-xs font-mono">Memuat galeri 3D...</span>
      </div>
    ),
  }
);

const AIChatWidget = dynamic(() => import("@/components/ui/AIChatWidget"), {
  ssr: false,
});

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette"), {
  ssr: false,
});

export default function Home() {
  const [lang, setLang] = useState<"ID" | "EN" | "AR">("ID");
  const [searchOpen, setSearchOpen] = useState(false);
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);

  const toggleLang = () => {
    setLang((prev) => (prev === "ID" ? "EN" : prev === "EN" ? "AR" : "ID"));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9] dark:bg-stone-950 text-[#1c1917] dark:text-stone-100 transition-colors">
      {/* Intro Animated Opening Badge (Runs once per session) */}
      <IntroLoader />

      {/* Subtle Desktop Cursor Glow Trail */}
      <CursorTrail />

      {/* Floating Direct WhatsApp Action Button (Bottom Right) */}
      <WhatsAppButton />

      {/* Floating Khadim AI Chat Assistant (Bottom Left, Lazy Loaded) */}
      <AIChatWidget />

      {/* Universal Search Command Palette (Cmd + K, Lazy Loaded) */}
      <CommandPalette isOpen={searchOpen} setIsOpen={setSearchOpen} />

      {/* Secret Developer Easter Egg (Konami Code) */}
      <EasterEgg />

      {/* Lead Magnet E-Book Download Modal */}
      <LeadMagnetModal
        isOpen={leadMagnetOpen}
        onClose={() => setLeadMagnetOpen(false)}
        lang={lang}
      />

      {/* Fixed Navbar with Glassmorphism */}
      <Navbar
        currentLang={lang}
        onSelectLang={setLang}
        onToggleLang={toggleLang}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with Canvas Pixel Reveal & Text Blend Mode */}
        <HeroSection
          name="CHAMDAN"
          tagline="Seorang Santri, Khadimul Ilmi yang merajut khazanah dari turats hingga rekayasa AI-Driven Web."
          lang={lang}
          onOpenLeadMagnet={() => setLeadMagnetOpen(true)}
        />

        {/* 2. About Section (Dark Background, Narrative & Info Card) */}
        <AboutSection lang={lang} />

        {/* 3. Skills Section (Light Background, Asymmetric Bento Grid) */}
        <SkillsSection lang={lang} />

        {/* 4. Projects Section (Featured Case Studies from Supabase) */}
        <ProjectsSection lang={lang} />

        {/* 5. Services & Pricing Section (Layanan, Rate Card & Booking Konsultasi) */}
        <ServicesSection lang={lang} />

        {/* 6. 3D Curved Gallery Section (Interactive Photo Cylinder, Lazy Loaded) */}
        <GallerySection lang={lang} />

        {/* 7. Writings Section (Risalah Digital & Academic Articles) */}
        <WritingsSection lang={lang} />

        {/* 8. Testimonials & Trust Signals Marquee */}
        <TestimonialsSection lang={lang} />

        {/* 9. Experience Section (Dark Background, Glowing Timeline from Supabase) */}
        <ExperienceSection lang={lang} />

        {/* 10. Education Section (Light Background, Sanad & Academic Grid from Supabase) */}
        <EducationSection lang={lang} />

        {/* 11. Jadwal Kajian & Halaqah Santri (Ma'had Aly, Tahfidz & Tech Lab) */}
        <JadwalKajianSection lang={lang} />

        {/* 12. Contact Section (Dark Glassmorphism, Interactive Form & Socials) */}
        <ContactSection lang={lang} />
      </main>

      {/* Cookie & Privacy Compliance Banner */}
      <CookieBanner />

      {/* Footer with Newsletter Strip, 3-Column Grid & Massive Typography */}
      <Footer lang={lang} />
    </div>
  );
}
