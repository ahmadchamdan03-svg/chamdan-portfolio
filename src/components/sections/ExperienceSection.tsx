"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Experience } from "@/types/database";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";

interface ExperienceSectionProps {
  lang?: "ID" | "EN" | "AR";
}

function TimelineCard({
  item,
}: {
  item: Experience;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.35, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex items-center gap-4 sm:gap-6 group"
    >
      {/* Node / Marker on the Timeline */}
      <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-900 border-2 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] shrink-0 group-hover:border-[#fbbf24] group-hover:scale-110 transition-all duration-300">
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 group-hover:bg-[#fbbf24] transition-colors" />
      </div>

      {/* Card Content with Glassmorphism */}
      <div className="flex-1 rounded-2xl bg-stone-900/80 backdrop-blur-xl border border-emerald-900/40 px-5 py-4 sm:px-6 sm:py-5 shadow-lg hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.12)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Organization Name */}
        <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
          {item.organization}
        </h3>

        {/* Period Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/40 text-emerald-300 text-xs font-mono font-medium self-start sm:self-auto shrink-0 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{item.period}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({ lang = "ID" }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress for glowing vertical timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 75%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    async function fetchExperiences() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from("experience")
          .select("*")
          .order("sort_order", { ascending: true });

        if (err) {
          throw err;
        }

        if (data) {
          // Chronological sort ensuring newest to oldest
          const sorted = [...data].sort((a, b) => {
            if (a.sort_order !== undefined && b.sort_order !== undefined && a.sort_order !== null && b.sort_order !== null) {
              return a.sort_order - b.sort_order;
            }
            const getYear = (p: string) => {
              if (p.includes("Sekarang") || p.includes("Present")) return 2099;
              const matches = p.match(/\d{4}/g);
              return matches ? parseInt(matches[matches.length - 1], 10) : 0;
            };
            return getYear(b.period) - getYear(a.period);
          });
          setExperiences(sorted);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat data pengalaman dari Supabase";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full py-28 px-4 sm:px-8 bg-[#0a100d] text-stone-200 overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 border-b border-stone-800/80 pb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {lang === "ID" ? (
                <>
                  Pengalaman <span className="text-emerald-400 italic">&amp; Pengabdian</span>
                </>
              ) : (
                <>
                  Experience <span className="text-emerald-400 italic">&amp; Service</span>
                </>
              )}
            </h2>
          </div>
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm">Menghubungkan ke database Supabase...</p>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="p-6 rounded-2xl bg-amber-950/50 border border-amber-800/60 text-amber-200 flex items-start gap-3 my-8">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Gagal memuat data dari Supabase</p>
              <p className="text-xs text-amber-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* State: Empty */}
        {!loading && !error && experiences.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-sm">Belum ada data pengalaman di database Supabase.</p>
          </div>
        )}

        {/* State: Success Timeline */}
        {!loading && !error && experiences.length > 0 && (
          <div className="relative">
            {/* 1. Static Dim Background Line */}
            <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-0.5 bg-stone-800 -translate-x-1/2" />

            {/* 2. Interactive Glowing Progress Line driven by Scroll */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-5 sm:left-6 top-6 bottom-6 w-1 origin-top -translate-x-1/2 bg-gradient-to-b from-emerald-400 via-[#fbbf24] to-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.9)] rounded-full z-0"
            />

            {/* 3. Timeline Items */}
            <div className="space-y-6 sm:space-y-8">
              {experiences.map((item) => (
                <TimelineCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
