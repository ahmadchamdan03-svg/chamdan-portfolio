"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Education } from "@/types/database";
import { GraduationCap, Calendar, BookOpen, Award, AlertCircle, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

interface EducationSectionProps {
  lang?: "ID" | "EN" | "AR";
}

export default function EducationSection({ lang = "ID" }: EducationSectionProps) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEducation() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from("education")
          .select("*")
          .order("created_at", { ascending: true });

        if (err) {
          throw err;
        }

        if (data) {
          setEducations(data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat data pendidikan dari Supabase";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchEducation();
  }, []);

  return (
    <section id="education" className="relative w-full py-24 px-4 sm:px-8 bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800 mb-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>{lang === "ID" ? "Sanad & Akademis" : "Sanad & Academic Credentials"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              {lang === "ID" ? (
                <>
                  Pendidikan <span className="text-[#064e3b] italic">&amp; Sanad Ilmiah</span>
                </>
              ) : (
                <>
                  Education <span className="text-[#064e3b] italic">&amp; Scientific Sanad</span>
                </>
              )}
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-3">
            <p className="text-sm text-stone-500 max-w-md">
              {lang === "ID"
                ? "Fondasi keilmuan Islam klasik (Turats) yang muttashil, dipadukan dengan ijazah sanad resmi Al-Qur'an dan kitab salaf."
                : "Continuous classical Islamic scholarship (Turats), coupled with verified sanad credentials in Quranic recitation and jurisprudence."}
            </p>
            <Link
              href="/verify-sanad"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all group"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === "ID" ? "Verifikasi Otentisitas Sanad (SHA-256)" : "Verify Sanad Authenticity (SHA-256)"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mb-3" />
            <p className="text-sm">Menghubungkan ke database Supabase...</p>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 my-8">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Gagal memuat data dari Supabase</p>
              <p className="text-xs text-amber-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* State: Empty */}
        {!loading && !error && educations.length === 0 && (
          <div className="text-center py-20 text-stone-500">
            <p className="text-sm">Belum ada data pendidikan di database Supabase.</p>
          </div>
        )}

        {/* State: Success Grid */}
        {!loading && !error && educations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {educations.map((item, idx) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-700/30 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Level Badge & Period */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/70">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.level}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-mono text-stone-500">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{item.period}</span>
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors leading-snug mb-3">
                    {item.institution}
                  </h3>

                  {/* Notes / Specialization Description */}
                  {item.notes && (
                    <div className="flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed mt-2 pt-3 border-t border-stone-100">
                      <BookOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <p>{item.notes}</p>
                    </div>
                  )}
                </div>

                {/* Bottom decorative index */}
                <div className="mt-6 pt-3 flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-100">
                  <span className="uppercase tracking-wider">Kredensial Resmi</span>
                  <span>0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
