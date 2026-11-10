"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Writing } from "@/types/database";
import { BookOpen, Calendar, ArrowRight, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Skeleton from "@/components/ui/Skeleton";

interface WritingsSectionProps {
  lang?: "ID" | "EN";
}

export default function WritingsSection({ lang = "ID" }: WritingsSectionProps) {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const { data, error } = await supabase
          .from("writings")
          .select("*")
          .order("date", { ascending: false });

        if (!error && data && data.length > 0) {
          setWritings(data);
        } else {
          // Fallback static
          setWritings([
            {
              id: "1",
              title: "Rekonstruksi Nalar Fikih di Era Kecerdasan Artifisial",
              category: "Risalah Fikih",
              description:
                "Telaah epistemologis metodologi ushul fikih dalam merespons otomasi penalaran dan model generatif modern.",
              date: "2026",
              slug: "rekonstruksi-nalar-fikih-era-ai",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              title: "Metodologi Bahtsul Masail: Dialektika Nash dan Konteks Modern",
              category: "Kajian Kontemporer",
              description:
                "Mekanisme istinbath hukum komparatif mazhab dalam tradisi intelektual Ma'had Aly Lirboyo.",
              date: "2025",
              slug: "metodologi-bahtsul-masail-dialektika-nash",
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              title: "Integrasi Turats Klasik dan Rekayasa Perangkat Lunak Modern",
              category: "Opini Ilmiah",
              description:
                "Sintesis komputasi terdistribusi dengan ketelitian takhrij dan kaidah verifikasi sanad khazanah Islam.",
              date: "2024",
              slug: "integrasi-turats-klasik-rekayasa-perangkat-lunak",
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Writings fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWritings();
  }, []);

  return (
    <section id="writings" className="py-24 sm:py-32 bg-[#0c1410] text-stone-100 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-900/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "ID" ? "Risalah Digital" : "Scholarly Treatises"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                {lang === "ID" ? "Karya Tulis & Pemikiran" : "Publications & Essays"}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-stone-400">
                {lang === "ID"
                  ? "Arsip pemikiran ilmiah, telaah ushul fikih, dan eksplorasi dialektika teknologi dari bilik Ma'had Aly Lirboyo."
                  : "Academic essays exploring the intersection of Islamic legal jurisprudence, traditional turats, and modern AI software systems."}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Writings List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-grow">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-5/6 h-4" />
                </div>
                <Skeleton className="w-32 h-10 rounded-full" />
              </div>
            ))
          ) : (
            writings.map((item, index) => {
              const articleHref = item.slug ? `/writings/${item.slug}` : (item.link || "#");
              return (
                <Reveal key={item.id} delay={index * 0.1}>
                  <Link
                    href={articleHref}
                    className="group block p-6 sm:p-8 rounded-2xl bg-stone-900/60 hover:bg-stone-900/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-950/40 backdrop-blur-md"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-stone-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-3xl">
                          {item.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-emerald-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                        <span>{lang === "ID" ? "Baca Risalah" : "Read Treatise"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
