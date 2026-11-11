"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Schedule } from "@/types/database";
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  User,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface JadwalKajianSectionProps {
  lang?: "ID" | "EN" | "AR";
}

export default function JadwalKajianSection({
  lang = "ID",
}: JadwalKajianSectionProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        setLoading(true);
        setError(null);
        const { data, error: err } = await supabase
          .from("schedules")
          .select("*")
          .order("created_at", { ascending: false });

        if (err) throw err;
        if (data) setSchedules(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal memuat jadwal kajian dari Supabase";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, []);

  // Compute unique categories
  const categories = [
    { id: "all", label: lang === "ID" ? "Semua Jadwal" : "All Schedules" },
    ...Array.from(new Set(schedules.map((s) => s.category).filter(Boolean))).map(
      (cat) => ({ id: cat, label: cat })
    ),
  ];

  const filteredJadwal =
    filterCategory === "all"
      ? schedules
      : schedules.filter(
          (item) => item.category?.toLowerCase() === filterCategory.toLowerCase()
        );

  const handleCopySchedule = (item: Schedule) => {
    const text = `${item.title}\nKategori: ${item.category}\nWaktu: ${item.date}, ${item.time}\nTempat: ${item.location}\nPengampu: ${item.speaker || "Ahmad Chamdan Yuwafin"}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section
      id="schedule"
      className="relative w-full py-24 px-4 sm:px-8 bg-stone-950 text-stone-100 overflow-hidden border-t border-stone-800"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-3">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>
                {lang === "ID" ? "Agenda & Jadwal Kajian" : "Teaching & Study Schedule"}
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {lang === "ID"
                ? "Jadwal Kajian Turats & Mentoring Santri"
                : "Weekly Teaching & Mentorship Schedule"}
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-3 text-stone-400 text-xs sm:text-sm leading-relaxed">
              {lang === "ID"
                ? "Halaqah keilmuan berkala yang diampu oleh Ahmad Chamdan Yuwafin di lingkungan Ma'had Aly Lirboyo, P3TQ, serta sesi coding Santri Developer."
                : "Regular teaching sessions and knowledge circles hosted by Ahmad Chamdan Yuwafin across Ma'had Aly Lirboyo and developer bootcamps."}
            </p>
          </Reveal>
        </div>

        {/* Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  filterCategory === tab.id
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
            <p className="text-xs font-mono">Memuat agenda kajian dari database...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs max-w-md mx-auto flex items-center gap-2.5 my-8">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJadwal.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            <p className="text-xs font-mono">Belum ada agenda kajian yang terdaftar untuk kategori ini.</p>
          </div>
        )}

        {/* Schedule Grid */}
        {!loading && !error && filteredJadwal.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJadwal.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 100}>
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>

                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400/90 italic font-serif">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-stone-800/80 text-xs text-stone-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    {item.speaker && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span>{item.speaker}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleCopySchedule(item)}
                      className="w-full py-2 px-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Jadwal Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Detail Jadwal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
