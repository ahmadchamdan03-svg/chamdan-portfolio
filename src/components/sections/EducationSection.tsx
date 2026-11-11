"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Education } from "@/types/database";
import { GraduationCap, Calendar, AlertCircle, Loader2 } from "lucide-react";

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
        const message =
          err instanceof Error
            ? err.message
            : "Gagal memuat data pendidikan dari Supabase";
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800 mb-2 font-mono">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>{lang === "ID" ? "Riwayat Pendidikan" : "Academic Background"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              {lang === "ID" ? (
                <>
                  Pendidikan <span className="text-[#064e3b] italic">&amp; Kesarjanaan</span>
                </>
              ) : (
                <>
                  Education <span className="text-[#064e3b] italic">&amp; Studies</span>
                </>
              )}
            </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {educations.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-stone-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all duration-300"
              >
                <div>
                  {/* Period Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/70">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.period}</span>
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors leading-snug">
                    {item.institution}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
