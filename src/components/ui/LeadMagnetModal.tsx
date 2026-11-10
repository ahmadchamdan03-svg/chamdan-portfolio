"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, Sparkles, X, Gift, Shield } from "lucide-react";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "ID" | "EN";
}

export default function LeadMagnetModal({
  isOpen,
  onClose,
  lang = "ID",
}: LeadMagnetModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Save subscriber to database
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name.trim() || undefined }),
      });

      // Even if subscription endpoint returns an error (e.g. duplicate email), allow download
      setDownloadReady(true);

      // Trigger automatic synthetic download of the automation guide
      const content = `PANDUAN PRAKTIS OTOMASI PERSURATAN & ADMINISTRASI PESANTREN MODERN
Penyusun: Ahmad Chamdan Yuwafin (Khadimul Ilmi & Developer)
Lisensi: Distribusi Bebas untuk Lembaga Pendidikan Islam & Pesantren

========================================================================
1. PENDAHULUAN: KRISIS 1.000 JAM KERJA MANUAL
Kebanyakan madrasah dan pondok pesantren menghabiskan ratusan jam setiap
menjelang Haflah atau pergantian semester hanya untuk:
- Mengetik nomor surat berulang-ulang
- Menyalin data santri manual dari formulir kertas ke lembar Excel
- Menulis piagam/sertifikat satu per satu

2. 3 PILAR ARSITEKTUR DIGITALISASI HEMAT BIAYA
A. Google Forms + Google Sheets App Script (Otomasi 0 Biaya)
   - Pasang trigger onFormSubmit() untuk generate PDF otomatis ke Google Drive.
   - Kirim notifikasi konfirmasi ke email wali santri seketika.

B. Template Excel VBA Macro (Offline First untuk Asrama)
   - Gunakan UserForm VBA dengan validasi Nomor Induk Santri (NIS).
   - Tombol "Cetak Kartu Massal" langsung mengekspor 500 kartu santri siap cetak.

C. Integrasi WhatsApp Gateway (Fonnte / WABA)
   - Sambungkan Webhook ke spreadsheet untuk notifikasi tagihan syahriyah & izin pulang.

3. KODE TEMPLATE STARTER VBA
Sub CetakSuratOtomatis()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("DataSantri")
    ' Kode loop otomatis generate surat dinas...
    MsgBox "50 Surat Dinas Berhasil Digenerate!", vbInformation, "Chamdan Automation"
End Sub

Butuh bantuan konsultasi arsitektur sistem pesantren Anda?
Hubungi langsung: ahmadchamdan03@gmail.com | https://www.chamdan.site
========================================================================
`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Panduan-Otomasi-Persuratan-Pesantren-Chamdan.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("Lead magnet submission error:", err);
      // Still allow download
      setDownloadReady(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-stone-950 border border-stone-800 p-6 sm:p-8 shadow-2xl text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {downloadReady ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {lang === "ID" ? "Panduan Telah Diunduh!" : "Guide Downloaded!"}
            </h3>
            <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
              {lang === "ID"
                ? "File Panduan Otomasi & Template VBA telah berhasil diunduh ke perangkat Anda. Email Anda juga telah tercatat untuk pembaruan fitur turats berikutnya."
                : "The Automation Guide & VBA template has been successfully saved to your device. You are now subscribed to future updates."}
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-stone-800 text-xs font-semibold text-white hover:bg-stone-700 transition-colors"
              >
                {lang === "ID" ? "Selesai & Tutup" : "Done & Close"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono mb-4">
              <Gift className="w-3.5 h-3.5" />
              <span>
                {lang === "ID" ? "Lead Magnet Gratis" : "Complimentary Resource"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight mb-2">
              {lang === "ID"
                ? "Panduan Otomasi Persuratan Pesantren & Template VBA"
                : "Pesantren Workflow Automation Guide & VBA Template"}
            </h3>

            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              {lang === "ID"
                ? "Hemat ratusan jam kerja panitia dan staf madrasah dengan blueprint otomasi surat dinas, formulir pendaftaran digital, dan rumus macro Excel siap pakai."
                : "Save hundreds of hours in institutional administration with this plug-and-play guide, macro scripts, and paperwork automation blueprint."}
            </p>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 mb-6 space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-stone-300">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Modul Blueprint Otomasi Google Workspace & Sheets</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Script Excel VBA Siap Pakai untuk Kartu & Piagam Santri</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-300">
                <Shield className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Tips Keamanan Data Santri & Bebas Biaya Server</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5">
                  Nama Anda / Lembaga
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Gus Fulan / Pengurus Ponpes"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-xs text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1.5">
                  Alamat Email Penerima *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emailanda@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-xs text-stone-200 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Menyiapkan File...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Unduh Panduan Gratis Sekarang (Instant Download)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}