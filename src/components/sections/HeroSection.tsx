"use client";

import PixelReveal from "./PixelReveal";

interface HeroSectionProps {
  name?: string;
  tagline?: string;
  lang?: "ID" | "EN";
}

export default function HeroSection({
  name = "CHAMDAN",
  tagline = "Santri Lirboyo, Khadimul Ilmi dan AI-Driven Web Developer",
  lang = "ID",
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#f4f7f5]"
    >
      {/* Background Subtle Accent Grids & Gold Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row: Left Tagline & Right Arabic Vertical Text */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-12 gap-4 items-start">
        {/* Left Column: Authentic Tagline */}
        <div className="col-span-8 sm:col-span-6 md:col-span-4 text-left">
          <div className="w-10 h-0.5 bg-[#064e3b] mb-4" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-stone-900 leading-snug">
            <span className="font-serif font-bold text-[#064e3b]">
              Santri Lirboyo
            </span>
            <span className="text-stone-400">, </span>
            <span className="font-semibold text-stone-800">
              Khadimul Ilmi
            </span>{" "}
            <span className="text-stone-500">
              {lang === "ID"
                ? "yang merajut khazanah turats dengan rekayasa"
                : "bridging classical turats with modern engineering:"}
            </span>{" "}
            <span className="font-bold text-emerald-800 underline decoration-amber-500 decoration-2 underline-offset-4">
              AI-Driven Web
            </span>
            <span className="text-stone-500">.</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-stone-500 font-normal leading-relaxed max-w-sm">
            {lang === "ID"
              ? "Dari kajian Fikih & Ushul Fikih hingga arsitektur aplikasi Next.js, Supabase, dan otomasi cerdas."
              : "From classical jurisprudence & logic to full-stack Next.js, Supabase architecture, and smart automation."}
          </p>
        </div>

        {/* Center Space reserved for Photo */}
        <div className="hidden md:block col-span-4" />

        {/* Right Column: Authentic Arabic Calligraphy "خادم العلم" */}
        <div className="col-span-4 sm:col-span-6 md:col-span-4 flex flex-col items-end">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-8 bg-amber-600/40 mb-2" />
              {/* Vertical Arabic Text */}
              <div
                lang="ar"
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl md:text-4xl font-bold text-[#064e3b] tracking-wider select-none leading-loose [writing-mode:vertical-rl] drop-shadow-sm"
              >
                خادم العلم
              </div>
              <span className="w-0.5 h-8 bg-amber-600/40 mt-2" />
            </div>
            <div className="hidden sm:flex flex-col text-right text-[11px] font-serif text-stone-500 tracking-widest uppercase">
              <span>Khadim</span>
              <span>Al-Ilmi</span>
              <span className="text-amber-600 font-semibold mt-1">Lirboyo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Layer: Interactive Pixel Reveal Photo */}
      <div className="relative z-20 w-full flex justify-center items-center my-[-2rem] sm:my-[-3rem] md:my-[-4rem]">
        <PixelReveal
          jacketSrc="/images/hero/jacket.png"
          blueshirtSrc="/images/hero/blueshirt.png"
          alt="Ahmad Chamdan Yuwafin"
        />
      </div>

      {/* Bottom Layer: Giant Name "CHAMDAN" with CSS mix-blend-mode */}
      <div className="relative z-30 w-full text-center pointer-events-none mt-auto">
        <h2
          className="font-sans font-black text-[17vw] sm:text-[18vw] md:text-[19vw] leading-[0.78] tracking-tighter uppercase select-none text-stone-900 mix-blend-difference"
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
          }}
        >
          {name}
        </h2>
      </div>
    </section>
  );
}
