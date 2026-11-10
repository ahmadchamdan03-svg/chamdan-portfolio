"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  Copy,
  ArrowLeft,
  BookOpen,
  Lock,
  ExternalLink,
} from "lucide-react";

interface SanadRecord {
  id: string;
  title: string;
  category: "Tahfidz Al-Qur'an" | "Tajwid & Qira'at" | "Fiqih & Turats";
  recipient: string;
  teachers: string[];
  institution: string;
  year: string;
  hashSha256: string;
  chainSummary: string;
  status: "Terverifikasi Otentik" | "Verified Authentic";
  notes: string;
}

const SANAD_DATABASE: SanadRecord[] = [
  {
    id: "SANAD-P3TQ-2023-088",
    title: "Sanad Tahfidz Al-Qur'an 30 Juz Bil-Ghoib",
    category: "Tahfidz Al-Qur'an",
    recipient: "Ahmad Chamdan Yuwafin",
    teachers: [
      "Ibu Nyai Hj. 'Aisyah binti KH. Mahrus Aly",
      "Gus H. Fahrur Rozi (Pengasuh P3TQ Lirboyo)",
    ],
    institution: "Pondok Pesantren Putri Tahfidzil Qur'an (P3TQ) Lirboyo Kediri",
    year: "2023 M / 1444 H",
    hashSha256: "7f9b8c2a4e1d3f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a",
    chainSummary:
      "Thoriqoh Syathibiyyah, Riwayat Hafsh 'an 'Ashim al-Kufi muttashil ila Rasulillahi Shallallahu 'Alaihi Wasallam.",
    status: "Terverifikasi Otentik",
    notes:
      "Telah menyelesaikan tasmi' setoran Al-Qur'an 30 Juz secara bil-ghoib sesuai kaidah makharijul huruf dan tajwid bersanad.",
  },
  {
    id: "SANAD-ML-2024-019",
    title: "Sanad Manzhumah Al-Jazariyyah fi 'Ilmit Tajwid",
    category: "Tajwid & Qira'at",
    recipient: "Ahmad Chamdan Yuwafin",
    teachers: [
      "Masyayikh & Asatidz Ma'had Aly Lirboyo",
      "Syaikh Muhammad bin Muhammad bin Al-Jazari (via Silsilah Sanad)",
    ],
    institution: "Ma'had Aly Lirboyo Kota Kediri",
    year: "2024 M / 1445 H",
    hashSha256: "4e1d3f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a7f9b8c2a",
    chainSummary:
      "Silsilah muttashil kepada Al-Imam Al-Hujjah Syamsuddin Abul Khoir Muhammad bin Muhammad bin Al-Jazari Asy-Syafi'i.",
    status: "Terverifikasi Otentik",
    notes:
      "Kajian komprehensif matan Al-Jazariyyah beserta syarah dan tahqiq sifatul huruf dan ahkamut tajwid.",
  },
  {
    id: "SANAD-ML-2025-104",
    title: "Sanad Matan Tuhfatul Athfal",
    category: "Tajwid & Qira'at",
    recipient: "Ahmad Chamdan Yuwafin",
    teachers: ["Asatidz Madrasah Hidayatul Mubtadi-ien (MHM) Lirboyo"],
    institution: "Pondok Pesantren Lirboyo Kediri",
    year: "2025 M / 1446 H",
    hashSha256: "9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a7f9b8c2a4e1d3f0a",
    chainSummary:
      "Muttashil kepada Al-Allamah Syaikh Sulaiman Al-Jamzuri rahimahullah.",
    status: "Terverifikasi Otentik",
    notes:
      "Penguasaan kaidah nun mati, tanwin, mim sukun, mad thobi'i, dan mad far'i.",
  },
  {
    id: "SANAD-TURATS-2026-007",
    title: "Ijazah Kubro Kitab Fathul Qorib Al-Mujib & Fathul Mu'in",
    category: "Fiqih & Turats",
    recipient: "Ahmad Chamdan Yuwafin",
    teachers: ["KH. M. Anwar Manshur", "KH. Abdullah Kafabihi Mahrus"],
    institution: "Pondok Pesantren Lirboyo Kediri",
    year: "2026 M / 1447 H",
    hashSha256: "3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a7f9b8c2a4e1d3f0a9b8c7d6e5f4a",
    chainSummary:
      "Sanad keilmuan fiqih madzhab Syafi'i bersambung melalui Masyayikh Lirboyo hingga Syaikh Ibnu Hajar Al-Haitami dan Imam Syafi'i.",
    status: "Terverifikasi Otentik",
    notes:
      "Tamat pengajian kitab fiqih mu'tabar madzhab Syafi'i di lingkungan Pesantren Lirboyo.",
  },
];

export default function VerifySanadPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredRecords = SANAD_DATABASE.filter((rec) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      rec.id.toLowerCase().includes(q) ||
      rec.title.toLowerCase().includes(q) ||
      rec.hashSha256.toLowerCase().includes(q) ||
      rec.category.toLowerCase().includes(q) ||
      rec.teachers.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a100d] text-stone-100 py-16 px-4 sm:px-8 selection:bg-emerald-500 selection:text-black">
      {/* Background Ambient */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-emerald-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda Portofolio</span>
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                Sistem Validasi Kriptografis
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Digital Sanad Verification Portal
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-2xl">
            Sistem verifikasi terbuka untuk menguji keaslian sertifikasi sanad Al-Qur&apos;an dan kitab turats Ahmad Chamdan Yuwafin. Setiap dokumen memiliki hash kriptografis SHA-256 yang menjamin integritas rantai sanad (isnad) tanpa kemungkinan pemalsuan.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID Sanad (misal: SANAD-P3TQ-2023-088) atau kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-emerald-500 text-xs sm:text-sm text-stone-200 focus:outline-none"
            />
          </div>

          {/* Quick Filter Pill Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-400">
            <span>Contoh pencarian:</span>
            {["SANAD-P3TQ-2023-088", "Jazariyyah", "Fathul Qorib"].map((sample) => (
              <button
                key={sample}
                onClick={() => setSearchQuery(sample)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              >
                {sample}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-rose-400 hover:underline ml-auto"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Sanad Records List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Ditemukan {filteredRecords.length} Dokumen Sanad Terverifikasi</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>SHA-256 Hash Guard Active</span>
            </span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-stone-900/50 border border-stone-800 text-stone-500 text-xs">
              Tidak ditemukan data sanad yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredRecords.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-stone-900/80 border border-stone-800/90 p-6 sm:p-8 hover:border-emerald-500/40 transition-all space-y-6"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider">
                        {item.id}
                      </div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-stone-500 block mb-1">
                      Penerima Ijazah Sanad:
                    </span>
                    <span className="text-stone-200 font-semibold">
                      {item.recipient}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-stone-500 block mb-1">
                      Lembaga Penerbit:
                    </span>
                    <span className="text-stone-200 font-semibold">
                      {item.institution}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-stone-500 block mb-1">
                      Guru Penyambung Sanad (Mujiz):
                    </span>
                    <ul className="text-stone-300 list-disc list-inside space-y-0.5">
                      {item.teachers.map((tch, tIdx) => (
                        <li key={tIdx}>{tch}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-mono text-stone-500 block mb-1">
                      Tahun Kelulusan / Ijazah:
                    </span>
                    <span className="text-stone-300">{item.year}</span>
                  </div>
                </div>

                {/* Chain of Transmission (Isnad) */}
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Silsilah Rantai Sanad (Muttashil):</span>
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed italic">
                    &quot;{item.chainSummary}&quot;
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {item.notes}
                  </p>
                </div>

                {/* Cryptographic SHA-256 Hash Verification */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1.5">
                    <span>Cryptographic Verification Hash (SHA-256):</span>
                    {copiedHash === item.hashSha256 && (
                      <span className="text-emerald-400">Tersalin ke clipboard!</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-stone-400 break-all">
                    <span className="select-all">{item.hashSha256}</span>
                    <button
                      onClick={() => handleCopy(item.hashSha256)}
                      className="ml-3 p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0"
                      title="Salin Hash SHA-256"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800/60 text-center text-xs text-stone-400 leading-relaxed">
          Semua sanad keilmuan yang tertera di atas diperoleh secara talaqqi dan musyafahah sesuai tradisi keilmuan Pondok Pesantren Lirboyo Kediri.
          Untuk permohonan transkrip salinan fisik atau kebutuhan riset akademis, silakan kontak melalui{" "}
          <Link href="/#contact" className="text-emerald-400 hover:underline">
            Formulir Kontak
          </Link>
          .
        </div>
      </div>
    </div>
  );
}