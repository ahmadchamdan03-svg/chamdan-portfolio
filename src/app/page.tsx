"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import GallerySection from "@/components/sections/GallerySection";
import WritingsSection from "@/components/sections/WritingsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import CursorTrail from "@/components/ui/CursorTrail";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import AIChatWidget from "@/components/ui/AIChatWidget";
import CommandPalette from "@/components/ui/CommandPalette";
import IntroLoader from "@/components/ui/IntroLoader";

export default function Home() {
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleLang = () => {
    setLang((prev) => (prev === "ID" ? "EN" : "ID"));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9] dark:bg-stone-950 text-[#1c1917] dark:text-stone-100 transition-colors">
      {/* Intro Animated Opening Badge (Runs once per session) */}
      <IntroLoader />

      {/* Subtle Desktop Cursor Glow Trail */}
      <CursorTrail />

      {/* Floating Direct WhatsApp Action Button (Bottom Right) */}
      <WhatsAppButton />

      {/* Floating Khadim AI Chat Assistant (Bottom Left) */}
      <AIChatWidget />

      {/* Universal Search Command Palette (Cmd + K) */}
      <CommandPalette isOpen={searchOpen} setIsOpen={setSearchOpen} />

      {/* Fixed Navbar with Glassmorphism */}
      <Navbar
        currentLang={lang}
        onToggleLang={toggleLang}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with Canvas Pixel Reveal & Text Blend Mode */}
        <HeroSection
          name="CHAMDAN"
          tagline="Santri Lirboyo, Khadimul Ilmi dan AI-Driven Web Developer"
          lang={lang}
        />

        {/* 2. About Section (Dark Background, Narrative & Info Card) */}
        <AboutSection lang={lang} />

        {/* 3. Skills Section (Light Background, Asymmetric Bento Grid) */}
        <SkillsSection lang={lang} />

        {/* 4. Projects Section (Featured Case Studies from Supabase) */}
        <ProjectsSection lang={lang} />

        {/* 5. 3D Curved Gallery Section (Interactive Photo Cylinder) */}
        <GallerySection lang={lang} />

        {/* 6. Writings Section (Risalah Digital & Academic Articles) */}
        <WritingsSection lang={lang} />

        {/* 7. Testimonials & Trust Signals Marquee */}
        <TestimonialsSection lang={lang} />

        {/* 8. Experience Section (Dark Background, Glowing Timeline from Supabase) */}
        <ExperienceSection lang={lang} />

        {/* 9. Education Section (Light Background, Sanad & Academic Grid from Supabase) */}
        <EducationSection lang={lang} />

        {/* 10. Contact Section (Dark Glassmorphism, Interactive Form & Socials) */}
        <ContactSection lang={lang} />
      </main>

      {/* Footer with Newsletter Strip, 3-Column Grid & Massive Typography */}
      <Footer lang={lang} />
    </div>
  );
}
