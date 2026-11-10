"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const toggleLang = () => {
    setLang((prev) => (prev === "ID" ? "EN" : "ID"));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9] text-[#1c1917]">
      {/* Fixed Navbar with Glassmorphism */}
      <Navbar currentLang={lang} onToggleLang={toggleLang} />

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

        {/* 5. Experience Section (Dark Background, Glowing Timeline from Supabase) */}
        <ExperienceSection lang={lang} />

        {/* 6. Education Section (Light Background, Sanad & Academic Grid from Supabase) */}
        <EducationSection lang={lang} />

        {/* 7. Contact Section (Dark Glassmorphism, CTA & Socials) */}
        <ContactSection lang={lang} />
      </main>

      {/* Footer with 3-Column Grid & Massive Typography */}
      <Footer lang={lang} />
    </div>
  );
}
