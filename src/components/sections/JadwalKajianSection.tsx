"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Copy,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface JadwalKajianSectionProps {
  lang?: "ID" | "EN";
}

interface KajianItem {
  id: string;
  dayID: string;
  dayEN: string;
  time: string;
  titleID: string;
  titleEN: string;
  kitab: string;
  venueID: string;
  venueEN: string;
  audienceID: string;
  audienceEN: string;
  category: "mahad-aly" | "tahfidz" | "turats" | "tech";
  status: "Rutin Mingguan" | "Weekly Regular";
}

export default function JadwalKajianSection({
  lang = "ID",
}: JadwalKajianSectionProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const jadwalList: KajianItem[] = [
    {
      id: "kajian-1",
      dayID: "Sabtu Malam Ahad",
      dayEN: "Saturday Evening",
      time: "19:45 - 21:30 WIB",
      titleID: "Kajian Qawa'id Fiqhiyyah & Ushul Fiqih",
      titleEN: "Islamic Legal Maxims & Principles",
      kitab: "Kitab Al-Asybah wan Nadza'ir (Imam As-Suyuthi)",
      venueID: "Gedung Ma'had Aly Lirboyo, Lt. 2",
      venueEN: "Ma'had Aly Lirboyo Building, 2nd Fl.",
      audienceID: "Mahasantri & Terbuka Umum",
      audienceEN: "Scholars & Public",
      category: "mahad-aly",
      status: "Rutin Mingguan",
    },
    {
      id: "kajian-2",
      dayID: "Ahad Pagi",
      dayEN: "Sunday Morning",
      time: "05:30 - 07:00 WIB",
      titleID: "Halaqah Tahfidz & Setoran Bil-Ghoib",
      titleEN: "Tahfidz Recitation & Tajwid Circle",
      kitab: "Matan Al-Jazariyyah fi Tajwidil Qur'an",
      venueID: "Komplek P3TQ Lirboyo Kediri",
      venueEN: "P3TQ Lirboyo Complex Kediri",
      audienceID: "Khusus Santri Tahfidz",
      audienceEN: "Tahfidz Students Only",
      category: "tahfidz",
      status: "Rutin Mingguan",
    },
    {
      id: "kajian-3",
      dayID: "Selasa Malam Rabu",
      dayEN: "Tuesday Evening",
      time: "20:00 - 21:30 WIB",
      titleID: "Pendalaman Fiqih Ibadah & Mu'amalah",
      titleEN: "Fiqh Jurisprudence Study",
      kitab: "Fathul Qorib Al-Mujib & Hasyiyah Al-Bajuri",
      venueID: "Aula MHM Pondok Pesantren Lirboyo",
      venueEN: "MHM Hall, Lirboyo Islamic Boarding School",
      audienceID: "Santri Madrasah & Jama'ah",
      audienceEN: "Madrasah Students & Community",
      category: "turats",
      status: "Rutin Mingguan",
    },
    {
      id: "kajian-4",
      dayID: "Kamis Sore",
      dayEN: "Thursday Afternoon",
      time: "16:00 - 17:30 WIB",
      titleID: "Santri Tech Lab: Otomasi Web & AI Workflow",
      titleEN: "Santri Tech Lab: Web & AI Automation",
      kitab: "Modul Praktis Next.js, Supabase & AI Assistant",
      venueID: "Laboratorium Komputer / Live Google Meet",
      venueEN: "Computer Lab / Online Stream",
      audienceID: "Komunitas Santri Developer",
      audienceEN: "Santri Developer Community",
      category: "tech",
      status: "Rutin Mingguan",
    },
  ];

  const filteredJadwal =
    filterCategory === "all"
      ? jadwalList
      : jadwalList.filter((item) => item.category === filterCategory);

  const handleCopySchedule = (item: KajianItem) => {
    const text = `${item.titleID} (${item.kitab})\nJadwal: ${item.dayID}, ${item.time}\nTempat: ${item.venueID}\nPengampu: Ahmad Chamdan Yuwafin`;
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
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", labelID: "Semua Jadwal", labelEN: "All" },
            { id: "mahad-aly", labelID: "Ma'had Aly", labelEN: "Ma'had Aly" },
            { id: "tahfidz", labelID: "Tahfidz & Tajwid", labelEN: "Tahfidz" },
            { id: "turats", labelID: "Kajian Fiqih", labelEN: "Fiqh Studies" },
            { id: "tech", labelID: "Santri Tech Lab", labelEN: "Tech Lab" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                filterCategory === tab.id
                  ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800"
              }`}
            >
              {lang === "ID" ? tab.labelID : tab.labelEN}
            </button>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJadwal.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 100}>
              <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-emerald-500/40 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{lang === "ID" ? item.dayID : item.dayEN}</span>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
                    {lang === "ID" ? item.titleID : item.titleEN}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400/90 italic font-serif">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.kitab}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-800/80 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{lang === "ID" ? item.venueID : item.venueEN}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{lang === "ID" ? item.audienceID : item.audienceEN}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleCopySchedule(item)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
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
      </div>
    </section>
  );
}