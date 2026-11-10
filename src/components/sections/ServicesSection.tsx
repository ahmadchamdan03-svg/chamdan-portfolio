"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Calendar,
  ArrowRight,
  MessageSquare,
  Clock,
  ShieldCheck,
  Zap,
  HelpCircle,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface ServicesSectionProps {
  lang?: "ID" | "EN" | "AR";
}

interface ServicePackage {
  id: string;
  titleID: string;
  titleEN: string;
  badge: string;
  badgeColor: string;
  priceRangeID: string;
  priceRangeEN: string;
  periodID: string;
  periodEN: string;
  descID: string;
  descEN: string;
  featuresID: string[];
  featuresEN: string[];
  highlight?: boolean;
}

export default function ServicesSection({ lang = "ID" }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState("");
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultNotes, setConsultNotes] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultSuccess, setConsultSuccess] = useState(false);

  const packages: ServicePackage[] = [
    {
      id: "paket-menengah",
      titleID: "Paket Menengah",
      titleEN: "Moderate Advisory",
      badge: "Sesi 1-on-1",
      badgeColor: "bg-stone-800/80 text-stone-300 border-stone-700/60",
      priceRangeID: "Rp 250.000",
      priceRangeEN: "$20",
      periodID: "45 Menit",
      periodEN: "45 Minutes",
      descID:
        "Sesi evaluasi teknis dasar untuk meninjau sistem atau alur kerja operasional lembaga Anda.",
      descEN:
        "Basic technical evaluation session reviewing institutional workflow and systems.",
      featuresID: [
        "Audit alur data & persuratan",
        "Rekomendasi tech stack dasar",
        "Dokumen ringkasan rekomendasi",
      ],
      featuresEN: [
        "Audit alur data & persuratan",
        "Rekomendasi tech stack dasar",
        "Dokumen ringkasan rekomendasi",
      ],
    },
    {
      id: "paket-agak-mahal",
      titleID: "Paket Agak Mahal",
      titleEN: "Strategic Advisory",
      badge: "Skala Menengah",
      badgeColor: "bg-stone-800/80 text-stone-300 border-stone-700/60",
      priceRangeID: "Rp 500.000",
      priceRangeEN: "$35",
      periodID: "60 Menit",
      periodEN: "60 Minutes",
      descID:
        "Analisis komprehensif alur kerja dengan fokus efisiensi otomasi dan estimasi anggaran server.",
      descEN:
        "Comprehensive workflow analysis focusing on automation efficiency and server budget.",
      featuresID: [
        "Semua di Paket Menengah",
        "Analisis roadmap otomasi",
        "Estimasi anggaran server",
      ],
      featuresEN: [
        "Semua di Paket Menengah",
        "Analisis roadmap otomasi",
        "Estimasi anggaran server",
      ],
    },
    {
      id: "paket-lumayan-mahal",
      titleID: "Paket Lumayan Mahal",
      titleEN: "Architecture & Automation",
      badge: "Paling Populer",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      highlight: true,
      priceRangeID: "Rp 1.000.000",
      priceRangeEN: "$70",
      periodID: "90 Menit",
      periodEN: "90 Minutes",
      descID:
        "Sesi arsitektur mendalam dengan desain basis data relasional dan panduan integrasi Fonnte / AI.",
      descEN:
        "Deep architecture session with relational database design and Fonnte / AI integration roadmap.",
      featuresID: [
        "Semua di Paket Agak Mahal",
        "Desain arsitektur database (ERD)",
        "Panduan implementasi Fonnte/AI",
      ],
      featuresEN: [
        "Semua di Paket Agak Mahal",
        "Desain arsitektur database (ERD)",
        "Panduan implementasi Fonnte/AI",
      ],
    },
    {
      id: "paket-mahal",
      titleID: "Paket Mahal",
      titleEN: "Intensive Pair Setup",
      badge: "Hands-on Setup",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      priceRangeID: "Rp 2.500.000",
      priceRangeEN: "$175",
      periodID: "2 Sesi (2x90 Menit)",
      periodEN: "2 Sessions (2x90 Min)",
      descID:
        "Pendampingan langsung setup server cloud production dan evaluasi menyeluruh terhadap kode aplikasi.",
      descEN:
        "Direct production cloud setup assistance and comprehensive codebase review.",
      featuresID: [
        "Semua di Paket Lumayan Mahal",
        "Pendampingan setup server Vercel/Supabase",
        "Review kode (Code Review)",
      ],
      featuresEN: [
        "Semua di Paket Lumayan Mahal",
        "Pendampingan setup server Vercel/Supabase",
        "Review kode (Code Review)",
      ],
    },
    {
      id: "paket-sangat-mahal",
      titleID: "Paket Sangat Mahal",
      titleEN: "Dedicated System Build",
      badge: "Enterprise Kustom",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      priceRangeID: "Rp 5.000.000+",
      priceRangeEN: "$350+",
      periodID: "Kustom (Bulanan)",
      periodEN: "Custom (Monthly)",
      descID:
        "Kemitraan teknis intensif sebulan penuh membangun sistem enterprise dari nol dengan garansi pemeliharaan.",
      descEN:
        "Full-month intensive technical partnership building enterprise systems from scratch with maintenance warranty.",
      featuresID: [
        "Konsultasi intensif 1 bulan",
        "Akses prioritas via WhatsApp",
        "Membangun sistem dari nol (End-to-End)",
        "Garansi maintenance 1 bulan",
      ],
      featuresEN: [
        "Konsultasi intensif 1 bulan",
        "Akses prioritas via WhatsApp",
        "Membangun sistem dari nol (End-to-End)",
        "Garansi maintenance 1 bulan",
      ],
    },
  ];

  const handleOpenBooking = (pkg?: ServicePackage) => {
    if (pkg) {
      setSelectedService(pkg);
      setBookingTopic(lang === "ID" ? pkg.titleID : pkg.titleEN);
    } else {
      setBookingTopic(
        lang === "ID" ? "Konsultasi Umum Digitalisasi" : "General Tech Consultation"
      );
    }
    setBookingModalOpen(true);
    setConsultSuccess(false);
  };

  const handleSendBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "6285899151685";
    const greeting =
      lang === "ID"
        ? `Halo Mas Chamdan, saya tertarik untuk mendiskusikan *${bookingTopic}*.\n\nNama: ${consultName}\nEmail: ${consultEmail}\nRencana Waktu: ${consultDate || "Fleksibel"}\nCatatan: ${consultNotes || "-"}`
        : `Hello Chamdan, I would like to schedule a session regarding *${bookingTopic}*.\n\nName: ${consultName}\nEmail: ${consultEmail}\nTarget Date: ${consultDate || "Flexible"}\nNotes: ${consultNotes || "-"}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;
    window.open(url, "_blank");
    setConsultSuccess(true);
  };

  return (
    <section
      id="services"
      className="relative w-full py-28 px-4 sm:px-8 bg-stone-900 text-stone-100 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal delay={100}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {lang === "ID"
                ? "Solusi Digital Berkelanjutan untuk Lembaga & Bisnis"
                : "Sustainable Digital Solutions for Institutions & Business"}
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed">
              {lang === "ID"
                ? "Estimasi harga transparan tanpa biaya tersembunyi. Dari konsultasi arsitektur, portal web madrasah, hingga otomatisasi kehadiran berbasis WhatsApp."
                : "Transparent pricing without hidden surprises. From architecture advisory and institutional portals to automated WhatsApp attendance platforms."}
            </p>
          </Reveal>
        </div>

        {/* Pricing & Services Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <Reveal key={pkg.id} delay={idx * 100}>
              <div
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 h-full ${
                  pkg.highlight
                    ? "bg-stone-950/90 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-950/50 ring-1 ring-emerald-500/30"
                    : "bg-stone-950/70 backdrop-blur-xl border border-stone-800 hover:border-stone-700"
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Paling Populer
                  </div>
                )}

                <div>
                  {/* Badge */}
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium border ${pkg.badgeColor} mb-4`}
                  >
                    {pkg.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-white mb-2 leading-snug">
                    {lang === "ID" ? pkg.titleID : pkg.titleEN}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-400 leading-relaxed mb-6">
                    {lang === "ID" ? pkg.descID : pkg.descEN}
                  </p>

                  {/* Price Range */}
                  <div className="mb-6 pt-4 border-t border-stone-800/80">
                    <div className="text-2xl font-bold font-sans text-white tracking-tight">
                      {lang === "ID" ? pkg.priceRangeID : pkg.priceRangeEN}
                    </div>
                    <div className="text-xs font-mono text-stone-400 mt-0.5">
                      {lang === "ID" ? pkg.periodID : pkg.periodEN}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-2">
                      {lang === "ID" ? "Termasuk dalam paket:" : "Included features:"}
                    </span>
                    {(lang === "ID" ? pkg.featuresID : pkg.featuresEN).map(
                      (feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-start gap-2 text-xs text-stone-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Booking Trigger Button */}
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    pkg.highlight
                      ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                      : "bg-stone-800 hover:bg-stone-700 text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jadwalkan Konsultasi</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <Reveal delay={400}>
          <div className="mt-12 p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                {lang === "ID"
                  ? "Garansi bug-free & pendampingan teknis gratis 30 hari pasca serah terima proyek."
                  : "30-day bug-free warranty and complimentary post-launch technical assistance."}
              </span>
            </div>
            <div className="flex items-center gap-4 text-stone-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Next.js 16</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>SLA Cepat</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Booking Appointment Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-stone-950 border border-stone-800 p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Tutup Modal"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                Pemesanan & Konsultasi Terjadwal
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                {selectedService
                  ? lang === "ID"
                    ? selectedService.titleID
                    : selectedService.titleEN
                  : "Jadwalkan Diskusi Teknis"}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Kirimkan detail kebutuhan Anda. Saya akan menghubungi kembali via WhatsApp untuk konfirmasi waktu dan tautan Google Meet.
              </p>
            </div>

            {consultSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">WhatsApp Terbuka!</h4>
                <p className="text-xs text-stone-300">
                  Pesan pemesanan Anda telah disiapkan di WhatsApp. Silakan tekan kirim pada aplikasi WhatsApp Anda untuk memulai perbincangan.
                </p>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-200 hover:bg-stone-700"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-stone-400 mb-1.5">
                    Nama Lengkap / Instansi *
                  </label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="Contoh: Gus Fulan / Pesantren Al-Hikmah"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-500 text-xs text-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 mb-1.5">
                    Alamat Email Kontak *
                  </label>
                  <input
                    type="email"
                    required
                    value={consultEmail}
                    onChange={(e) => setConsultEmail(e.target.value)}
                    placeholder="email@instansi.id"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-500 text-xs text-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 mb-1.5">
                    Rencana Waktu / Tanggal Sesi
                  </label>
                  <input
                    type="date"
                    value={consultDate}
                    onChange={(e) => setConsultDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-500 text-xs text-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 mb-1.5">
                    Ringkasan Kebutuhan / Permasalahan Sistem
                  </label>
                  <textarea
                    rows={3}
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    placeholder="Ceritakan kendala sistem manual atau fitur apa yang ingin dibuat..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-500 text-xs text-stone-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Lanjutkan ke WhatsApp untuk Konfirmasi Slot</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}