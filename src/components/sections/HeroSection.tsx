"use client";

import PixelReveal from "./PixelReveal";
import { Download, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  name?: string;
  tagline?: string;
  lang?: "ID" | "EN" | "AR";
  onOpenLeadMagnet?: () => void;
}

export default function HeroSection({
  name = "CHAMDAN",
  lang = "ID",
  onOpenLeadMagnet,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-4 px-4 sm:px-8 overflow-hidden bg-[#fafaf9] dark:bg-stone-950 transition-colors"
    >
      {/* Top Layer: Editorial Header Layout */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
        {/* Left Column: Authentic Title Narrative */}
        <div className="max-w-md sm:max-w-lg">
          <h1 className="font-sans text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight text-stone-900 dark:text-stone-100 font-medium">
            <span className="font-serif font-bold text-[#064e3b] dark:text-emerald-400">
              Seorang Santri
            </span>
            <span className="text-stone-400">, </span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Khadimul Ilmi
            </span>{" "}
            <span className="text-stone-500 dark:text-stone-400">
              {lang === "ID"
                ? "yang merajut khazanah dari turats hingga rekayasa"
                : "bridging classical turats to modern engineering:"}
            </span>{" "}
            <span className="font-bold text-emerald-800 dark:text-emerald-400 underline decoration-amber-500 decoration-2 underline-offset-4">
              AI-Driven Web
            </span>
            <span className="text-stone-500 dark:text-stone-400">.</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-normal leading-relaxed max-w-sm">
            {lang === "ID"
              ? "Dari kajian Fikih & Ushul Fikih hingga otomasi sistem."
              : "From Islamic jurisprudence (Fikih) to system automation."}
          </p>

          {/* Action CTAs: Download CV & Explore */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="/api/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#064e3b] text-[#fbbf24] hover:bg-[#022c22] text-xs font-semibold shadow-md transition-all border border-emerald-600/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === "ID" ? "Unduh CV Resmi" : "Download CV (PDF)"}</span>
            </a>

            {onOpenLeadMagnet && (
              <button
                type="button"
                onClick={onOpenLeadMagnet}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
              >
                <span>🎁 {lang === "ID" ? "E-Book Otomasi" : "Free E-Book"}</span>
              </button>
            )}

            <a
              href="#about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 text-xs font-medium transition-all"
            >
              <span>{lang === "ID" ? "Jelajahi" : "Explore"}</span>
              <ArrowDown className="w-3.5 h-3.5 text-stone-500" />
            </a>
          </div>
        </div>

        {/* Center Space reserved for Photo on desktop */}
        <div className="hidden md:block flex-1" />

        {/* Right Column: Authentic Arabic Calligraphy "خادم العلم" & 3-Word Stack */}
        <div className="flex items-center gap-3 sm:gap-4 self-end md:self-start shrink-0">
          <div className="flex flex-col items-center">
            <span className="w-0.5 h-6 sm:h-8 bg-amber-600/40 mb-2" />
            {/* Vertical Arabic Text */}
            <div
              lang="ar"
              dir="rtl"
              className="font-arabic text-2xl sm:text-3xl md:text-4xl font-bold text-[#064e3b] tracking-wider select-none leading-loose [writing-mode:vertical-rl] drop-shadow-sm"
            >
              خادم العلم
            </div>
            <span className="w-0.5 h-6 sm:h-8 bg-amber-600/40 mt-2" />
          </div>

          {/* 3 Distinct Words Stacked Vertically with clean spacing */}
          <div className="flex flex-col text-right font-serif tracking-widest uppercase text-stone-600">
            <span className="block text-xs sm:text-sm font-medium leading-tight">
              Khadim
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-stone-800 leading-tight mt-1">
              Al-Ilmi
            </span>
            <span className="block text-xs sm:text-sm font-bold text-amber-600 leading-tight mt-1.5">
              Lirboyo
            </span>
          </div>
        </div>
      </div>

      {/* Center Layer: Interactive Pixel Reveal Photo with Bottom Gradient Fade */}
      <div className="relative z-10 w-full flex justify-center items-center mt-4 sm:mt-2 md:mt-0 mb-[-2rem] sm:mb-[-3rem] md:mb-[-4rem]">
        <PixelReveal
          jacketSrc="/images/hero/jacket.png"
          blueshirtSrc="/images/hero/blueshirt.png"
          alt="Ahmad Chamdan Yuwafin"
        />
        {/* Soft gradient fade at bottom to blend with background seamlessly */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#fafaf9] dark:from-stone-950 to-transparent pointer-events-none z-20" />
      </div>

      {/* Bottom Layer: Giant Name "CHAMDAN" with CSS mix-blend-mode */}
      <div className="relative z-30 w-full text-center pointer-events-none mt-auto">
        <h2 className="font-sans font-black text-[17vw] sm:text-[18vw] md:text-[19vw] leading-[0.78] tracking-tighter uppercase select-none text-stone-900 dark:text-stone-100 mix-blend-difference">
          {name}
        </h2>
      </div>
    </section>
  );
}
