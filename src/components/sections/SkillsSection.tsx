"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types/database";
import { Wrench, BookOpen, Cpu, ShieldCheck, Zap, Users, Loader2, Sparkles } from "lucide-react";

interface SkillsSectionProps {
  lang?: "ID" | "EN";
}

// Icon mapper for aesthetic authentic representation
const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("turats") || cat.includes("pesantren")) {
    return <BookOpen className="w-5 h-5 text-amber-700" />;
  }
  if (cat.includes("web") || cat.includes("frontend")) {
    return <Cpu className="w-5 h-5 text-emerald-700" />;
  }
  if (cat.includes("backend") || cat.includes("database") || cat.includes("security")) {
    return <ShieldCheck className="w-5 h-5 text-emerald-800" />;
  }
  if (cat.includes("ai") || cat.includes("automation")) {
    return <Zap className="w-5 h-5 text-amber-600" />;
  }
  if (cat.includes("kepemimpinan") || cat.includes("manajemen")) {
    return <Users className="w-5 h-5 text-emerald-900" />;
  }
  return <Wrench className="w-5 h-5 text-stone-700" />;
};

export default function SkillsSection({ lang = "ID" }: SkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from("skills")
          .select("*")
          .order("created_at", { ascending: true });

        if (err) {
          throw err;
        }

        if (data && data.length > 0) {
          setSkills(data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat skills";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="relative w-full py-24 px-4 sm:px-8 bg-[#fafaf9] overflow-hidden">
      {/* Subtle Background Emerald Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{lang === "ID" ? "Matriks Keahlian" : "Competence Matrix"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              Skills &amp; <span className="text-[#064e3b] italic">Expertise</span>
            </h2>
          </div>

          <p className="mt-3 sm:mt-0 text-sm text-stone-600 max-w-md">
            {lang === "ID"
              ? "Perpaduan unik tradisi kajian kitab kuning klasik (Turats) dan spesialisasi rekayasa perangkat lunak modern."
              : "A unique synthesis of classical Islamic scholarship (Turats) and modern software engineering specialization."}
          </p>
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mb-3" />
            <p className="text-sm">Memuat data keahlian dari Supabase...</p>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs my-4">
            {error}
          </div>
        )}

        {/* State: Success Bento Grid */}
        {!loading && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(190px,auto)]">
            {skills.map((skill, index) => {
              // Asymmetric Bento Grid span rules:
              // Index 0: span 7 (Major feature: Keilmuan Turats)
              // Index 1: span 5 (Modern Web)
              // Index 2: span 4 (Backend)
              // Index 3: span 4 (AI Automation)
              // Index 4: span 4 (Kepemimpinan)
              let spanClass = "md:col-span-4";
              let cardBg = "bg-white";
              let borderAccent = "border-stone-200 hover:border-emerald-600/40";

              if (index === 0) {
                spanClass = "md:col-span-7 bg-gradient-to-br from-white via-emerald-50/20 to-amber-50/30";
                borderAccent = "border-emerald-200/80 hover:border-amber-500/60";
              } else if (index === 1) {
                spanClass = "md:col-span-5 bg-gradient-to-br from-white to-stone-50";
                borderAccent = "border-stone-200 hover:border-emerald-700/50";
              }

              return (
                <div
                  key={skill.id}
                  className={`group relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${spanClass} ${cardBg} ${borderAccent}`}
                >
                  {/* Card Top: Icon & Category Name */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-stone-100/80 flex items-center justify-center border border-stone-200/60 group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(skill.category)}
                      </div>
                      <span className="text-[11px] font-mono text-stone-400 font-semibold tracking-wider">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors">
                      {skill.category}
                    </h3>
                  </div>

                  {/* Card Bottom: Skill Items Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skill.items?.map((item, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="px-3 py-1.5 rounded-full bg-stone-100/90 text-stone-800 text-xs font-medium border border-stone-200/50 group-hover:bg-white group-hover:border-emerald-600/30 transition-colors shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
